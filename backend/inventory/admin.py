from django.contrib import admin

from .models import InventoryUnit


@admin.register(InventoryUnit)
class InventoryUnitAdmin(admin.ModelAdmin):
    list_display = (
        "vin",
        "truck",
        "status",
        "warehouse",
        "purchase_cost",
        "selling_price",
    )
    list_filter = ("status", "warehouse")
    search_fields = ("vin", "engine_number", "truck__model")
