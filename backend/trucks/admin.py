from django.contrib import admin

from .models import Quotation, QuotationItem, Truck


class QuotationItemInline(admin.TabularInline):
    model = QuotationItem
    extra = 0


@admin.register(Truck)
class TruckAdmin(admin.ModelAdmin):
    list_display = (
        "brand",
        "model_name",
        "drive_type",
        "horsepower",
        "retail_price_aed",
        "stock_vin_count",
    )
    list_filter = ("brand", "drive_type", "emission_standard")
    search_fields = ("brand", "model_name", "engine_model")


@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
    list_display = (
        "quote_number",
        "company_name",
        "client_name",
        "total_price_aed",
        "created_at",
    )
    search_fields = ("quote_number", "company_name", "client_name", "client_email")
    inlines = [QuotationItemInline]


@admin.register(QuotationItem)
class QuotationItemAdmin(admin.ModelAdmin):
    list_display = ("quotation", "truck", "quantity", "unit_selling_price_aed")
