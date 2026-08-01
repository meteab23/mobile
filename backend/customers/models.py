from django.db import models


class Customer(models.Model):
    """B2B customer companies purchasing trucks in the UAE."""

    class PaymentTerms(models.TextChoices):
        IMMEDIATE = "immediate", "Cash / Immediate"
        NET_15 = "net_15", "Net 15"
        NET_30 = "net_30", "Net 30"
        NET_45 = "net_45", "Net 45"
        NET_60 = "net_60", "Net 60"
        LC = "lc", "Letter of Credit"

    company_name = models.CharField(max_length=200, unique=True, db_index=True)
    trade_license = models.CharField(max_length=50, unique=True)
    vat_number = models.CharField(max_length=30)
    address = models.TextField()
    city = models.CharField(max_length=80, default="Dubai")
    emirate = models.CharField(max_length=50, default="Dubai")
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    contact_person = models.CharField(max_length=120)
    contact_title = models.CharField(max_length=80, blank=True)
    payment_terms = models.CharField(
        max_length=20, choices=PaymentTerms.choices, default=PaymentTerms.NET_30
    )
    credit_limit = models.DecimalField(max_digits=14, decimal_places=2, default=500000)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["company_name"]

    def __str__(self):
        return self.company_name
