from django.contrib import admin

from .models import Truck


@admin.register(Truck)
class TruckAdmin(admin.ModelAdmin):
    list_display = (
        "brand",
        "model",
        "year",
        "category",
        "horsepower",
        "price",
        "availability",
        "vin",
        "warehouse",
    )
    list_filter = ("brand", "category", "availability", "year")
    search_fields = ("vin", "engine_number", "model", "brand")
