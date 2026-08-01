from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import QuotationViewSet, TruckViewSet, generate_quotation_pdf

router = DefaultRouter()
router.register(r"trucks", TruckViewSet, basename="truck")
router.register(r"quotations", QuotationViewSet, basename="quotation")

urlpatterns = [
    # Custom PDF endpoint before router so "generate-pdf" is not treated as a pk
    path("quotations/generate-pdf/", generate_quotation_pdf, name="generate-quotation-pdf"),
    path("", include(router.urls)),
]
