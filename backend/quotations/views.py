from django.http import HttpResponse
from django_filters import rest_framework as filters
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from common.permissions import ReadOnlyOrSalesStaff
from .models import Quotation
from .pdf import QuotationPDFService
from .serializers import (
    QuotationDetailSerializer,
    QuotationListSerializer,
    QuotationWriteSerializer,
)
from .services import QuotationService


class QuotationFilter(filters.FilterSet):
    status = filters.CharFilter(lookup_expr="iexact")
    customer = filters.NumberFilter(field_name="customer_id")
    salesperson = filters.NumberFilter(field_name="salesperson_id")
    date_from = filters.DateFilter(field_name="date", lookup_expr="gte")
    date_to = filters.DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = Quotation
        fields = ["status", "customer", "salesperson", "currency"]


class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.select_related("customer", "salesperson").prefetch_related(
        "items__truck"
    )
    permission_classes = [ReadOnlyOrSalesStaff]
    filterset_class = QuotationFilter
    search_fields = [
        "quotation_number",
        "customer__company_name",
        "salesperson__username",
        "notes",
    ]
    ordering_fields = ["date", "grand_total", "status", "quotation_number", "created_at"]
    ordering = ["-date", "-created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return QuotationListSerializer
        if self.action in ("create", "update", "partial_update"):
            return QuotationWriteSerializer
        return QuotationDetailSerializer

    def create(self, request, *args, **kwargs):
        serializer = QuotationWriteSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        quotation = serializer.save()
        return Response(
            QuotationDetailSerializer(quotation).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = QuotationWriteSerializer(
            instance, data=request.data, partial=partial, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        quotation = serializer.save()
        return Response(QuotationDetailSerializer(quotation).data)

    @action(detail=True, methods=["post"])
    def change_status(self, request, pk=None):
        quotation = self.get_object()
        new_status = request.data.get("status")
        if not new_status:
            return Response(
                {"success": False, "message": "status is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            QuotationService.change_status(quotation, new_status)
        except ValueError as exc:
            return Response(
                {"success": False, "message": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(QuotationDetailSerializer(quotation).data)

    @action(detail=True, methods=["get"])
    def pdf(self, request, pk=None):
        quotation = self.get_object()
        pdf_bytes = QuotationPDFService.render(quotation)
        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        filename = f"{quotation.quotation_number}.pdf"
        response["Content-Disposition"] = f'inline; filename="{filename}"'
        return response
