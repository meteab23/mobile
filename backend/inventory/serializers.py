from rest_framework import serializers

from .models import InventoryUnit


class InventoryUnitSerializer(serializers.ModelSerializer):
    truck_name = serializers.CharField(source="truck.display_name", read_only=True)
    brand = serializers.CharField(source="truck.brand", read_only=True)
    model = serializers.CharField(source="truck.model", read_only=True)
    year = serializers.IntegerField(source="truck.year", read_only=True)
    category = serializers.CharField(source="truck.category", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = InventoryUnit
        fields = (
            "id",
            "truck",
            "truck_name",
            "brand",
            "model",
            "year",
            "category",
            "vin",
            "engine_number",
            "purchase_cost",
            "selling_price",
            "status",
            "status_display",
            "warehouse",
            "location_bay",
            "arrival_date",
            "notes",
            "updated_at",
        )
        read_only_fields = ("updated_at",)
