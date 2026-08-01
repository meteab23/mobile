from django.contrib import admin

from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = (
        "company_name",
        "contact_person",
        "city",
        "phone",
        "payment_terms",
        "credit_limit",
        "is_active",
    )
    search_fields = ("company_name", "trade_license", "vat_number", "email")
    list_filter = ("emirate", "payment_terms", "is_active")
