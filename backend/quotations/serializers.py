from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from customers.models import Customer
from trucks.models import Truck
from .models import Quotation, QuotationItem
from .services import QuotationService


class QuotationItemSerializer(serializers.ModelSerializer):
    truck_name = serializers.CharField(source="truck.display_name", read_only=True)
    truck_vin = serializers.CharField(source="truck.vin", read_only=True)
    truck_brand = serializers.CharField(source="truck.brand", read_only=True)

    class Meta:
        model = QuotationItem
        fields = (
            "id",
            "truck",
            "truck_name",
            "truck_vin",
            "truck_brand",
            "description",
            "quantity",
            "unit_price",
            "discount_percent",
            "line_total",
            "sort_order",
        )
        read_only_fields = ("line_total",)


class QuotationItemWriteSerializer(serializers.Serializer):
    truck_id = serializers.IntegerField()
    description = serializers.CharField(required=False, allow_blank=True, default="")
    quantity = serializers.IntegerField(min_value=1, default=1)
    unit_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    discount_percent = serializers.DecimalField(
        max_digits=5, decimal_places=2, default=Decimal("0"), required=False
    )


class QuotationListSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.company_name", read_only=True)
    salesperson_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    items_count = serializers.IntegerField(source="items.count", read_only=True)

    class Meta:
        model = Quotation
        fields = (
            "id",
            "quotation_number",
            "customer",
            "customer_name",
            "salesperson",
            "salesperson_name",
            "date",
            "valid_until",
            "currency",
            "status",
            "status_display",
            "subtotal",
            "discount_amount",
            "vat_amount",
            "grand_total",
            "items_count",
            "created_at",
        )

    def get_salesperson_name(self, obj):
        return obj.salesperson.get_full_name() or obj.salesperson.username


class QuotationDetailSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source="customer.company_name", read_only=True)
    customer_detail = serializers.SerializerMethodField()
    salesperson_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Quotation
        fields = "__all__"

    def get_salesperson_name(self, obj):
        return obj.salesperson.get_full_name() or obj.salesperson.username

    def get_customer_detail(self, obj):
        c = obj.customer
        return {
            "id": c.id,
            "company_name": c.company_name,
            "trade_license": c.trade_license,
            "vat_number": c.vat_number,
            "address": c.address,
            "phone": c.phone,
            "email": c.email,
            "contact_person": c.contact_person,
        }


class QuotationWriteSerializer(serializers.Serializer):
    customer_id = serializers.IntegerField()
    validity_days = serializers.IntegerField(min_value=1, default=30, required=False)
    currency = serializers.CharField(max_length=3, default="AED", required=False)
    discount_percent = serializers.DecimalField(
        max_digits=5, decimal_places=2, default=Decimal("0"), required=False
    )
    discount_amount = serializers.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0"), required=False
    )
    notes = serializers.CharField(required=False, allow_blank=True, default="")
    terms_and_conditions = serializers.CharField(required=False, allow_blank=True, default="")
    status = serializers.ChoiceField(
        choices=Quotation.Status.choices, default=Quotation.Status.DRAFT, required=False
    )
    items = QuotationItemWriteSerializer(many=True)

    def validate_customer_id(self, value):
        if not Customer.objects.filter(pk=value).exists():
            raise serializers.ValidationError("Customer not found.")
        return value

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("At least one item is required.")
        for item in value:
            if not Truck.objects.filter(pk=item["truck_id"]).exists():
                raise serializers.ValidationError(f"Truck {item['truck_id']} not found.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]
        return QuotationService.create_quotation(
            salesperson=request.user,
            customer_id=validated_data["customer_id"],
            items_data=validated_data["items"],
            validity_days=validated_data.get("validity_days", 30),
            currency=validated_data.get("currency", "AED"),
            discount_percent=validated_data.get("discount_percent", Decimal("0")),
            discount_amount=validated_data.get("discount_amount", Decimal("0")),
            notes=validated_data.get("notes", ""),
            terms_and_conditions=validated_data.get("terms_and_conditions", ""),
            status=validated_data.get("status", Quotation.Status.DRAFT),
        )

    @transaction.atomic
    def update(self, instance, validated_data):
        return QuotationService.update_quotation(instance, validated_data)
