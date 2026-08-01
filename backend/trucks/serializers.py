from rest_framework import serializers

from .models import Truck


class TruckListSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    availability_display = serializers.CharField(source="get_availability_display", read_only=True)
    display_name = serializers.CharField(read_only=True)

    class Meta:
        model = Truck
        fields = (
            "id",
            "brand",
            "model",
            "display_name",
            "year",
            "category",
            "category_display",
            "horsepower",
            "drive_type",
            "fuel",
            "emission",
            "vin",
            "color",
            "price",
            "cost",
            "stock_quantity",
            "availability",
            "availability_display",
            "image_url",
            "warehouse",
            "created_at",
        )


class TruckDetailSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    availability_display = serializers.CharField(source="get_availability_display", read_only=True)
    display_name = serializers.CharField(read_only=True)
    margin = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Truck
        fields = "__all__"


class TruckWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Truck
        exclude = ("created_at", "updated_at")
