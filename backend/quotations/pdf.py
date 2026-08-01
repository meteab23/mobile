"""PDF generation service using WeasyPrint + HTML/CSS templates."""
from io import BytesIO

from django.conf import settings
from django.template.loader import render_to_string
from weasyprint import HTML


class QuotationPDFService:
    @staticmethod
    def render(quotation) -> bytes:
        """Return PDF bytes for a quotation."""
        company = settings.COMPANY
        context = {
            "quotation": quotation,
            "items": quotation.items.select_related("truck").all(),
            "customer": quotation.customer,
            "salesperson": quotation.salesperson,
            "company": company,
            "vat_rate_pct": float(quotation.vat_rate) * 100,
        }
        html_string = render_to_string("pdf/quotation.html", context)
        pdf_file = BytesIO()
        HTML(string=html_string, base_url=str(settings.BASE_DIR)).write_pdf(pdf_file)
        return pdf_file.getvalue()
