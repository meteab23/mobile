from django_filters import rest_framework as filters
from rest_framework import viewsets

from common.permissions import ReadOnlyOrSalesStaff
from .models import Customer
from .serializers import CustomerSerializer


class CustomerFilter(filters.FilterSet):
    emirate = filters.CharFilter(lookup_expr="iexact")
    payment_terms = filters.CharFilter(lookup_expr="iexact")
    is_active = filters.BooleanFilter()

    class Meta:
        model = Customer
        fields = ["emirate", "payment_terms", "is_active", "city"]


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [ReadOnlyOrSalesStaff]
    filterset_class = CustomerFilter
    search_fields = [
        "company_name",
        "trade_license",
        "vat_number",
        "email",
        "contact_person",
        "phone",
    ]
    ordering_fields = ["company_name", "credit_limit", "created_at", "city"]
    ordering = ["company_name"]
