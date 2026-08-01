"""Quotation business logic — numbering, totals, status transitions."""
from datetime import timedelta
from decimal import Decimal

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from customers.models import Customer
from trucks.models import Truck
from .models import Quotation, QuotationItem


DEFAULT_TERMS = """\
1. Prices are quoted in UAE Dirhams (AED) and exclusive of VAT unless stated otherwise.
2. This quotation is valid until the date shown above.
3. Delivery lead time is subject to stock availability and shipping schedules from OEM yards.
4. Payment terms as per the customer's approved credit arrangement with Gulf Heavy Trucks Trading LLC.
5. Vehicles remain the property of the Seller until full payment is received.
6. Warranty is as per manufacturer terms stated on each line item / specification sheet.
7. Any cancellation after written acceptance may incur restocking and logistics charges.
8. UAE VAT at 5% applies to taxable supplies in accordance with Federal Decree-Law No. 8 of 2017.
"""


class QuotationService:
    @staticmethod
    def next_quotation_number() -> str:
        year = timezone.localdate().year
        prefix = f"QT-{year}-"
        last = (
            Quotation.objects.filter(quotation_number__startswith=prefix)
            .order_by("-quotation_number")
            .first()
        )
        if last:
            try:
                seq = int(last.quotation_number.split("-")[-1]) + 1
            except ValueError:
                seq = Quotation.objects.count() + 1
        else:
            seq = 1
        return f"{prefix}{seq:04d}"

    @classmethod
    @transaction.atomic
    def create_quotation(
        cls,
        *,
        salesperson,
        customer_id,
        items_data,
        validity_days=30,
        currency="AED",
        discount_percent=Decimal("0"),
        discount_amount=Decimal("0"),
        notes="",
        terms_and_conditions="",
        status=Quotation.Status.DRAFT,
        date=None,
    ) -> Quotation:
        customer = Customer.objects.get(pk=customer_id)
        quote_date = date or timezone.localdate()
        quotation = Quotation.objects.create(
            quotation_number=cls.next_quotation_number(),
            customer=customer,
            salesperson=salesperson,
            date=quote_date,
            validity_days=validity_days,
            valid_until=quote_date + timedelta(days=validity_days),
            currency=currency,
            discount_percent=discount_percent,
            discount_amount=discount_amount,
            vat_rate=Decimal(str(settings.VAT_RATE)),
            notes=notes,
            terms_and_conditions=terms_and_conditions or DEFAULT_TERMS,
            status=status,
        )
        cls._replace_items(quotation, items_data)
        quotation.recalculate_totals()
        return quotation

    @classmethod
    @transaction.atomic
    def update_quotation(cls, quotation: Quotation, data: dict) -> Quotation:
        if "customer_id" in data:
            quotation.customer = Customer.objects.get(pk=data["customer_id"])
        if "validity_days" in data:
            quotation.validity_days = data["validity_days"]
            quotation.valid_until = quotation.date + timedelta(days=data["validity_days"])
        for field in (
            "currency",
            "discount_percent",
            "discount_amount",
            "notes",
            "terms_and_conditions",
            "status",
        ):
            if field in data:
                setattr(quotation, field, data[field])
        quotation.save()
        if "items" in data:
            quotation.items.all().delete()
            cls._replace_items(quotation, data["items"])
        quotation.recalculate_totals()
        return quotation

    @staticmethod
    def _replace_items(quotation: Quotation, items_data: list) -> None:
        for idx, item in enumerate(items_data):
            truck = Truck.objects.get(pk=item["truck_id"])
            unit_price = item.get("unit_price")
            if unit_price is None:
                unit_price = truck.price
            QuotationItem.objects.create(
                quotation=quotation,
                truck=truck,
                description=item.get("description") or "",
                quantity=item.get("quantity", 1),
                unit_price=unit_price,
                discount_percent=item.get("discount_percent", Decimal("0")),
                sort_order=idx,
            )

    @staticmethod
    def change_status(quotation: Quotation, new_status: str) -> Quotation:
        allowed = {c.value for c in Quotation.Status}
        if new_status not in allowed:
            raise ValueError(f"Invalid status: {new_status}")
        quotation.status = new_status
        quotation.save(update_fields=["status", "updated_at"])
        # When converted, mark related trucks as reserved/sold for demo realism
        if new_status == Quotation.Status.CONVERTED:
            for item in quotation.items.select_related("truck"):
                truck = item.truck
                if truck.availability == Truck.Availability.AVAILABLE:
                    truck.availability = Truck.Availability.RESERVED
                    truck.save(update_fields=["availability", "updated_at"])
                    if hasattr(truck, "inventory_unit"):
                        unit = truck.inventory_unit
                        unit.status = "reserved"
                        unit.save(update_fields=["status", "updated_at"])
        return quotation
