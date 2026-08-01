from django.conf import settings
from django.db import models
from django.utils import timezone

from customers.models import Customer
from trucks.models import Truck


class Quotation(models.Model):
    """Sales quotation for one or more trucks."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SENT = "sent", "Sent"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        CONVERTED = "converted", "Converted"

    quotation_number = models.CharField(max_length=30, unique=True, db_index=True)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name="quotations")
    salesperson = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="quotations",
    )
    date = models.DateField(default=timezone.localdate)
    validity_days = models.PositiveIntegerField(default=30)
    valid_until = models.DateField()
    currency = models.CharField(max_length=3, default="AED")
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    vat_rate = models.DecimalField(max_digits=5, decimal_places=4, default=0.05)
    notes = models.TextField(blank=True)
    terms_and_conditions = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.DRAFT, db_index=True
    )
    subtotal = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    vat_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.quotation_number} — {self.customer.company_name}"

    def recalculate_totals(self):
        """Recompute financial totals from line items."""
        from decimal import Decimal

        lines = list(self.items.all())
        line_sum = sum((item.line_total for item in lines), Decimal("0"))
        # Prefer explicit discount_amount; otherwise apply percent on subtotal of lines
        discount = self.discount_amount
        if discount == 0 and self.discount_percent:
            discount = (line_sum * self.discount_percent / Decimal("100")).quantize(
                Decimal("0.01")
            )
            self.discount_amount = discount
        taxable = line_sum - discount
        if taxable < 0:
            taxable = Decimal("0")
        vat = (taxable * self.vat_rate).quantize(Decimal("0.01"))
        self.subtotal = line_sum
        self.vat_amount = vat
        self.grand_total = taxable + vat
        self.save(
            update_fields=[
                "subtotal",
                "discount_amount",
                "vat_amount",
                "grand_total",
                "updated_at",
            ]
        )


class QuotationItem(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name="items")
    truck = models.ForeignKey(Truck, on_delete=models.PROTECT, related_name="quotation_items")
    description = models.TextField(blank=True)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    line_total = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.truck.display_name} x{self.quantity}"

    def compute_line_total(self):
        from decimal import Decimal

        gross = self.unit_price * self.quantity
        discount = (gross * self.discount_percent / Decimal("100")).quantize(Decimal("0.01"))
        self.line_total = gross - discount
        return self.line_total

    def save(self, *args, **kwargs):
        self.compute_line_total()
        if not self.description:
            t = self.truck
            self.description = (
                f"{t.brand} {t.model} {t.year} | {t.horsepower} HP | {t.drive_type} | "
                f"{t.emission} | VIN: {t.vin}"
            )
        super().save(*args, **kwargs)
