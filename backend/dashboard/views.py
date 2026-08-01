from calendar import monthrange
from decimal import Decimal

from django.db.models import Count, Q, Sum
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from customers.models import Customer
from customers.serializers import CustomerSerializer
from quotations.models import Quotation
from quotations.serializers import QuotationListSerializer
from trucks.models import Truck


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        month_start = today.replace(day=1)
        _, last_day = monthrange(today.year, today.month)
        month_end = today.replace(day=last_day)

        trucks = Truck.objects.all()
        status_counts = {
            "total": trucks.count(),
            "available": trucks.filter(availability="available").count(),
            "reserved": trucks.filter(availability="reserved").count(),
            "sold": trucks.filter(availability="sold").count(),
            "in_transit": trucks.filter(availability="in_transit").count(),
        }

        inventory_value = trucks.filter(
            availability__in=["available", "reserved", "in_transit"]
        ).aggregate(total=Sum("price"))["total"] or Decimal("0")

        inventory_cost = trucks.filter(
            availability__in=["available", "reserved", "in_transit"]
        ).aggregate(total=Sum("cost"))["total"] or Decimal("0")

        sales_this_month = Quotation.objects.filter(
            status__in=["approved", "converted"],
            date__gte=month_start,
            date__lte=month_end,
        ).aggregate(total=Sum("grand_total"))["total"] or Decimal("0")

        quotations_by_status = list(
            Quotation.objects.values("status")
            .annotate(count=Count("id"), value=Sum("grand_total"))
            .order_by("status")
        )

        trucks_by_brand = list(
            trucks.values("brand").annotate(count=Count("id")).order_by("-count")
        )

        trucks_by_category = list(
            trucks.values("category").annotate(count=Count("id")).order_by("-count")
        )

        # Monthly sales trend — last 6 months
        monthly_sales = []
        for i in range(5, -1, -1):
            m = today.month - i
            y = today.year
            while m <= 0:
                m += 12
                y -= 1
            start = today.replace(year=y, month=m, day=1)
            _, ld = monthrange(y, m)
            end = start.replace(day=ld)
            total = Quotation.objects.filter(
                status__in=["approved", "converted", "sent"],
                date__gte=start,
                date__lte=end,
            ).aggregate(total=Sum("grand_total"))["total"] or Decimal("0")
            monthly_sales.append(
                {
                    "month": start.strftime("%b %Y"),
                    "total": total,
                }
            )

        recent_quotations = Quotation.objects.select_related(
            "customer", "salesperson"
        ).order_by("-created_at")[:8]
        latest_customers = Customer.objects.filter(is_active=True).order_by("-created_at")[:6]

        return Response(
            {
                "stats": {
                    **status_counts,
                    "inventory_value": inventory_value,
                    "inventory_cost": inventory_cost,
                    "sales_this_month": sales_this_month,
                    "customers_count": Customer.objects.filter(is_active=True).count(),
                    "quotations_count": Quotation.objects.count(),
                    "open_quotations": Quotation.objects.filter(
                        status__in=["draft", "sent"]
                    ).count(),
                },
                "charts": {
                    "quotations_by_status": quotations_by_status,
                    "trucks_by_brand": trucks_by_brand,
                    "trucks_by_category": trucks_by_category,
                    "monthly_sales": monthly_sales,
                },
                "recent_quotations": QuotationListSerializer(recent_quotations, many=True).data,
                "latest_customers": CustomerSerializer(latest_customers, many=True).data,
            }
        )
