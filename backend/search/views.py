from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from customers.models import Customer
from quotations.models import Quotation
from trucks.models import Truck


class GlobalSearchView(APIView):
    """Search VIN, trucks, customers, quotations, brands, models."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        q = (request.query_params.get("q") or "").strip()
        if len(q) < 2:
            return Response({"query": q, "results": {"trucks": [], "customers": [], "quotations": []}})

        trucks = Truck.objects.filter(
            Q(vin__icontains=q)
            | Q(engine_number__icontains=q)
            | Q(brand__icontains=q)
            | Q(model__icontains=q)
            | Q(description__icontains=q)
        )[:10]

        customers = Customer.objects.filter(
            Q(company_name__icontains=q)
            | Q(trade_license__icontains=q)
            | Q(vat_number__icontains=q)
            | Q(contact_person__icontains=q)
            | Q(email__icontains=q)
        )[:10]

        quotations = Quotation.objects.select_related("customer").filter(
            Q(quotation_number__icontains=q) | Q(customer__company_name__icontains=q)
        )[:10]

        return Response(
            {
                "query": q,
                "results": {
                    "trucks": [
                        {
                            "id": t.id,
                            "type": "truck",
                            "label": t.display_name,
                            "subtitle": f"{t.vin} · {t.get_availability_display()} · AED {t.price:,.0f}",
                            "brand": t.brand,
                            "model": t.model,
                            "vin": t.vin,
                        }
                        for t in trucks
                    ],
                    "customers": [
                        {
                            "id": c.id,
                            "type": "customer",
                            "label": c.company_name,
                            "subtitle": f"{c.contact_person} · {c.city}",
                        }
                        for c in customers
                    ],
                    "quotations": [
                        {
                            "id": qt.id,
                            "type": "quotation",
                            "label": qt.quotation_number,
                            "subtitle": f"{qt.customer.company_name} · {qt.get_status_display()} · AED {qt.grand_total:,.0f}",
                            "status": qt.status,
                        }
                        for qt in quotations
                    ],
                },
            }
        )
