from django.db import models

from trucks.models import Truck


class InventoryUnit(models.Model):
    """
    Individual physical truck unit tracked in inventory.
    Catalog Truck may represent a model; InventoryUnit is a specific VIN/engine unit.
    For this demo, each Truck catalog entry maps 1:1 to an InventoryUnit.
    """

    class Status(models.TextChoices):
        AVAILABLE = "available", "Available"
        RESERVED = "reserved", "Reserved"
        SOLD = "sold", "Sold"
        IN_TRANSIT = "in_transit", "In Transit"

    truck = models.OneToOneField(Truck, on_delete=models.CASCADE, related_name="inventory_unit")
    vin = models.CharField(max_length=17, unique=True, db_index=True)
    engine_number = models.CharField(max_length=40, unique=True)
    purchase_cost = models.DecimalField(max_digits=12, decimal_places=2)
    selling_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.AVAILABLE, db_index=True
    )
    warehouse = models.CharField(max_length=80, default="Al Quoz Yard A")
    location_bay = models.CharField(max_length=40, blank=True)
    arrival_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["warehouse", "vin"]
        verbose_name = "Inventory Unit"
        verbose_name_plural = "Inventory Units"

    def __str__(self):
        return f"{self.vin} ({self.get_status_display()})"
