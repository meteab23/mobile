from datetime import timedelta
from decimal import Decimal

from django.db import models
from django.db.models import Max
from django.utils import timezone


class Truck(models.Model):
    """Commercial truck inventory model for UAE B2B fleet sales."""

    brand = models.CharField(max_length=100)
    model_name = models.CharField(max_length=200)
    drive_type = models.CharField(max_length=20, help_text="e.g. 6x4, 8x4, 4x2")
    horsepower = models.PositiveIntegerField()
    emission_standard = models.CharField(max_length=50)
    engine_model = models.CharField(max_length=150)
    transmission = models.CharField(max_length=150)
    specs = models.JSONField(
        default=dict,
        help_text="Deep technical specs: axle, cargo, cabin, fuel, safety, etc.",
    )
    fob_price_usd = models.DecimalField(max_digits=12, decimal_places=2)
    landed_cost_aed = models.DecimalField(max_digits=12, decimal_places=2)
    retail_price_aed = models.DecimalField(max_digits=12, decimal_places=2)
    stock_vin_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["brand", "model_name"]

    def __str__(self):
        return f"{self.brand} {self.model_name}"

    @property
    def specs_display(self):
        """Human-readable spec rows for PDF/UI."""
        return [
            (str(key).replace("_", " ").title(), value)
            for key, value in (self.specs or {}).items()
        ]


class Quotation(models.Model):
    """B2B sales quotation with UAE FTA 5% VAT."""

    quote_number = models.CharField(max_length=20, unique=True, blank=True)
    client_name = models.CharField(max_length=150)
    company_name = models.CharField(max_length=200)
    client_phone = models.CharField(max_length=40)
    client_email = models.EmailField()
    subtotal_aed = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal("0.00"))
    vat_aed = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal("0.00"))
    total_price_aed = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal("0.00"))
    created_at = models.DateTimeField(auto_now_add=True)
    valid_until = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.quote_number or f"Draft for {self.company_name}"

    def save(self, *args, **kwargs):
        if not self.quote_number:
            self.quote_number = self._generate_quote_number()
        if not self.valid_until:
            self.valid_until = timezone.localdate() + timedelta(days=15)
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_quote_number():
        year = timezone.localdate().year
        prefix = f"QT-{year}-"
        latest = (
            Quotation.objects.filter(quote_number__startswith=prefix)
            .aggregate(Max("quote_number"))
            .get("quote_number__max")
        )
        if latest:
            try:
                seq = int(latest.split("-")[-1]) + 1
            except (ValueError, IndexError):
                seq = 1
        else:
            seq = 1
        return f"{prefix}{seq:04d}"

    def recalculate_totals(self):
        subtotal = Decimal("0.00")
        for item in self.items.all():
            subtotal += item.line_total
        self.subtotal_aed = subtotal.quantize(Decimal("0.01"))
        self.vat_aed = (self.subtotal_aed * Decimal("0.05")).quantize(Decimal("0.01"))
        self.total_price_aed = (self.subtotal_aed + self.vat_aed).quantize(Decimal("0.01"))
        self.save(update_fields=["subtotal_aed", "vat_aed", "total_price_aed"])


class QuotationItem(models.Model):
    """Line item on a quotation."""

    quotation = models.ForeignKey(
        Quotation, related_name="items", on_delete=models.CASCADE
    )
    truck = models.ForeignKey(Truck, related_name="quotation_items", on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    unit_selling_price_aed = models.DecimalField(max_digits=12, decimal_places=2)
    custom_notes = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.quantity}x {self.truck} @ AED {self.unit_selling_price_aed}"

    @property
    def line_total(self):
        return (self.unit_selling_price_aed * self.quantity).quantize(Decimal("0.01"))
