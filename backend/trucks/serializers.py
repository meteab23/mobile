from decimal import Decimal

from rest_framework import serializers

from .models import Quotation, QuotationItem, Truck


class TruckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Truck
        fields = [
            "id",
            "brand",
            "model_name",
            "drive_type",
            "horsepower",
            "emission_standard",
            "engine_model",
            "transmission",
            "specs",
            "fob_price_usd",
            "landed_cost_aed",
            "retail_price_aed",
            "stock_vin_count",
            "created_at",
            "updated_at",
        ]


class QuotationItemSerializer(serializers.ModelSerializer):
    truck_detail = TruckSerializer(source="truck", read_only=True)
    line_total = serializers.DecimalField(
        max_digits=14, decimal_places=2, read_only=True
    )

    class Meta:
        model = QuotationItem
        fields = [
            "id",
            "truck",
            "truck_detail",
            "quantity",
            "unit_selling_price_aed",
            "custom_notes",
            "line_total",
        ]


class QuotationItemWriteSerializer(serializers.Serializer):
    truck_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    unit_selling_price_aed = serializers.DecimalField(
        max_digits=12, decimal_places=2, min_value=Decimal("0.01")
    )
    custom_notes = serializers.CharField(required=False, allow_blank=True, default="")


class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, read_only=True)

    class Meta:
        model = Quotation
        fields = [
            "id",
            "quote_number",
            "client_name",
            "company_name",
            "client_phone",
            "client_email",
            "subtotal_aed",
            "vat_aed",
            "total_price_aed",
            "created_at",
            "valid_until",
            "items",
        ]
        read_only_fields = [
            "quote_number",
            "subtotal_aed",
            "vat_aed",
            "total_price_aed",
            "created_at",
            "valid_until",
        ]


class QuotationCreateSerializer(serializers.Serializer):
    client_name = serializers.CharField(max_length=150)
    company_name = serializers.CharField(max_length=200)
    client_phone = serializers.CharField(max_length=40)
    client_email = serializers.EmailField()
    items = QuotationItemWriteSerializer(many=True, min_length=1)

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        quotation = Quotation.objects.create(**validated_data)

        for item in items_data:
            truck = Truck.objects.get(pk=item["truck_id"])
            QuotationItem.objects.create(
                quotation=quotation,
                truck=truck,
                quantity=item["quantity"],
                unit_selling_price_aed=item["unit_selling_price_aed"],
                custom_notes=item.get("custom_notes", ""),
            )

        quotation.recalculate_totals()
        return quotation

    def validate_items(self, items):
        truck_ids = [item["truck_id"] for item in items]
        existing = set(Truck.objects.filter(pk__in=truck_ids).values_list("pk", flat=True))
        missing = [tid for tid in truck_ids if tid not in existing]
        if missing:
            raise serializers.ValidationError(
                f"Unknown truck id(s): {', '.join(map(str, missing))}"
            )
        return items
