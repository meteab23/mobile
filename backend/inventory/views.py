from django.db.models import Count, Sum
from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from common.permissions import ReadOnlyOrManager
from .models import InventoryUnit
from .serializers import InventoryUnitSerializer


class InventoryFilter(filters.FilterSet):
    status = filters.CharFilter(lookup_expr="iexact")
    warehouse = filters.CharFilter(lookup_expr="icontains")
    brand = filters.CharFilter(field_name="truck__brand", lookup_expr="iexact")

    class Meta:
        model = InventoryUnit
        fields = ["status", "warehouse"]


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = InventoryUnit.objects.select_related("truck").all()
    serializer_class = InventoryUnitSerializer
    permission_classes = [ReadOnlyOrManager]
    filterset_class = InventoryFilter
    search_fields = ["vin", "engine_number", "truck__brand", "truck__model", "warehouse"]
    ordering_fields = ["vin", "status", "selling_price", "purchase_cost", "updated_at"]
    ordering = ["warehouse", "vin"]
    http_method_names = ["get", "patch", "head", "options"]

    @action(detail=False, methods=["get"])
    def summary(self, request):
        qs = InventoryUnit.objects.all()
        by_status = (
            qs.values("status")
            .annotate(count=Count("id"), value=Sum("selling_price"), cost=Sum("purchase_cost"))
            .order_by("status")
        )
        by_warehouse = (
            qs.values("warehouse")
            .annotate(count=Count("id"), value=Sum("selling_price"))
            .order_by("warehouse")
        )
        return Response(
            {
                "total_units": qs.count(),
                "by_status": list(by_status),
                "by_warehouse": list(by_warehouse),
            }
        )
