from django.contrib import admin

from .models import Quotation, QuotationItem


class QuotationItemInline(admin.TabularInline):
    model = QuotationItem
    extra = 0


@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
    list_display = (
        "quotation_number",
        "customer",
        "salesperson",
        "date",
        "status",
        "grand_total",
    )
    list_filter = ("status", "date")
    search_fields = ("quotation_number", "customer__company_name")
    inlines = [QuotationItemInline]


@admin.register(QuotationItem)
class QuotationItemAdmin(admin.ModelAdmin):
    list_display = ("quotation", "truck", "quantity", "unit_price", "line_total")
