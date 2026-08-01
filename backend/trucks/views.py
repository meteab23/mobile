from django_filters import rest_framework as filters
from rest_framework import viewsets

from common.permissions import ReadOnlyOrManager
from .models import Truck
from .serializers import TruckDetailSerializer, TruckListSerializer, TruckWriteSerializer


class TruckFilter(filters.FilterSet):
    brand = filters.CharFilter(lookup_expr="iexact")
    category = filters.CharFilter(lookup_expr="iexact")
    availability = filters.CharFilter(lookup_expr="iexact")
    year = filters.NumberFilter()
    min_price = filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="price", lookup_expr="lte")
    min_hp = filters.NumberFilter(field_name="horsepower", lookup_expr="gte")
    max_hp = filters.NumberFilter(field_name="horsepower", lookup_expr="lte")

    class Meta:
        model = Truck
        fields = ["brand", "category", "availability", "year", "drive_type", "emission"]


class TruckViewSet(viewsets.ModelViewSet):
    queryset = Truck.objects.all()
    permission_classes = [ReadOnlyOrManager]
    filterset_class = TruckFilter
    search_fields = ["vin", "engine_number", "brand", "model", "description", "color"]
    ordering_fields = [
        "brand",
        "model",
        "year",
        "price",
        "horsepower",
        "availability",
        "created_at",
    ]
    ordering = ["brand", "model"]

    def get_serializer_class(self):
        if self.action == "list":
            return TruckListSerializer
        if self.action in ("create", "update", "partial_update"):
            return TruckWriteSerializer
        return TruckDetailSerializer
