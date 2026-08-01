from django.db import models


class Truck(models.Model):
    """Catalog model for heavy trucks imported from Chinese manufacturers."""

    class Brand(models.TextChoices):
        SHACMAN = "Shacman", "Shacman"
        HOWO = "Sinotruk HOWO", "Sinotruk HOWO"
        FAW = "FAW", "FAW"
        DONGFENG = "Dongfeng", "Dongfeng"
        FOTON = "Foton", "Foton"
        JAC = "JAC", "JAC"

    class Category(models.TextChoices):
        TIPPER = "tipper", "Tipper"
        TRACTOR = "tractor", "Tractor Head"
        CARGO = "cargo", "Cargo Truck"
        MIXER = "mixer", "Concrete Mixer"
        TANKER = "tanker", "Tanker"
        FLATBED = "flatbed", "Flatbed"

    class Availability(models.TextChoices):
        AVAILABLE = "available", "Available"
        RESERVED = "reserved", "Reserved"
        SOLD = "sold", "Sold"
        IN_TRANSIT = "in_transit", "In Transit"

    brand = models.CharField(max_length=50, choices=Brand.choices, db_index=True)
    model = models.CharField(max_length=100, db_index=True)
    year = models.PositiveIntegerField()
    category = models.CharField(max_length=20, choices=Category.choices, db_index=True)
    horsepower = models.PositiveIntegerField()
    engine = models.CharField(max_length=120)
    transmission = models.CharField(max_length=80)
    drive_type = models.CharField(max_length=20, help_text="e.g. 6x4, 4x2, 8x4")
    fuel = models.CharField(max_length=30, default="Diesel")
    emission = models.CharField(max_length=30, help_text="e.g. Euro 5, Euro 6")
    cab_type = models.CharField(max_length=80)
    payload_kg = models.PositiveIntegerField(help_text="Payload capacity in kg")
    gross_weight_kg = models.PositiveIntegerField()
    wheelbase_mm = models.PositiveIntegerField()
    dimensions = models.CharField(max_length=80, help_text="L x W x H in mm")
    fuel_tank_l = models.PositiveIntegerField()
    tyre_size = models.CharField(max_length=40)
    vin = models.CharField(max_length=17, unique=True, db_index=True)
    engine_number = models.CharField(max_length=40, unique=True)
    color = models.CharField(max_length=40)
    price = models.DecimalField(max_digits=12, decimal_places=2, help_text="Selling price AED")
    cost = models.DecimalField(max_digits=12, decimal_places=2, help_text="Purchase cost AED")
    stock_quantity = models.PositiveIntegerField(default=1)
    availability = models.CharField(
        max_length=20, choices=Availability.choices, default=Availability.AVAILABLE, db_index=True
    )
    image_url = models.URLField(blank=True, help_text="Placeholder image URL")
    description = models.TextField(blank=True)
    warranty = models.CharField(max_length=120, default="12 months / 100,000 km")
    warehouse = models.CharField(max_length=80, default="Al Quoz Yard A")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["brand", "model", "-year"]
        indexes = [
            models.Index(fields=["brand", "model"]),
            models.Index(fields=["availability", "category"]),
        ]

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year}) — {self.vin}"

    @property
    def display_name(self):
        return f"{self.brand} {self.model}"

    @property
    def margin(self):
        return self.price - self.cost
