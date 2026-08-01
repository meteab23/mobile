from io import BytesIO

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from weasyprint import HTML

from .models import Quotation, Truck
from .serializers import (
    QuotationCreateSerializer,
    QuotationSerializer,
    TruckSerializer,
)


class TruckViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Truck.objects.all()
    serializer_class = TruckSerializer


class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.prefetch_related("items__truck").all()
    http_method_names = ["get", "post", "head", "options"]

    def get_serializer_class(self):
        if self.action == "create":
            return QuotationCreateSerializer
        return QuotationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quotation = serializer.save()
        output = QuotationSerializer(quotation)
        return Response(output.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"], url_path="pdf")
    def pdf(self, request, pk=None):
        quotation = get_object_or_404(
            Quotation.objects.prefetch_related("items__truck"), pk=pk
        )
        return _render_quotation_pdf(quotation)


@api_view(["POST"])
def generate_quotation_pdf(request):
    """
    Create a quotation from payload and return the WeasyPrint PDF immediately.
    Used by the React dashboard "Generate & Download PDF" button.
    """
    serializer = QuotationCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    quotation = serializer.save()
    return _render_quotation_pdf(quotation)


def _render_quotation_pdf(quotation):
    html_string = render_to_string(
        "quotation_pdf.html",
        {
            "quotation": quotation,
            "items": quotation.items.select_related("truck").all(),
            "dealership": {
                "name": "Gulf Sino Trucks Trading LLC",
                "trn": "100492837100003",
                "address_line1": "Office 2408, Dubai Maritime City",
                "address_line2": "Al Mina Road, Dubai, United Arab Emirates",
                "phone": "+971 4 555 0180",
                "email": "sales@gulfsinotrucks.ae",
                "website": "www.gulfsinotrucks.ae",
            },
        },
    )
    pdf_buffer = BytesIO()
    HTML(string=html_string, base_url=".").write_pdf(pdf_buffer)
    pdf_buffer.seek(0)

    response = HttpResponse(pdf_buffer.getvalue(), content_type="application/pdf")
    filename = f"{quotation.quote_number}.pdf"
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response
