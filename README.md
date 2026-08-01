# Gulf Sino Trucks — UAE Commercial Truck Dealership Prototype

B2B sales dashboard for a Dubai-based Chinese truck importer. Django REST + WeasyPrint PDF quotations, React (Vite + Tailwind) catalog and quote builder.

## Stack

- **Backend:** Django 5+/6, Django REST Framework, WeasyPrint, SQLite
- **Frontend:** React (Vite), Tailwind CSS, Lucide icons
- **Market:** UAE FTA VAT 5%, AED pricing, Dubai Maritime City dealership

## Project structure

```
backend/
  dealership/          # Django project settings & URLs
  trucks/
    models.py          # Truck, Quotation, QuotationItem
    serializers.py
    views.py           # API + WeasyPrint PDF endpoint
    templates/quotation_pdf.html
    management/commands/seed_trucks.py
  requirements.txt
  manage.py
frontend/
  src/
    App.jsx
    api.js
    components/
      TruckCard.jsx
      SpecsModal.jsx
      QuotationBuilder.jsx
  package.json
```

## Quick start

### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_trucks
python manage.py runserver 8000
```

WeasyPrint needs system libraries (usually preinstalled on Ubuntu):

```bash
# If PDF generation fails, install:
sudo apt-get install -y libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf-2.0-0 fonts-dejavu-core
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — Vite proxies `/api` to Django on port 8000.

### 3. Demo flow

1. Browse the 4 seeded trucks (Sinotruk HOWO T7H, Shacman X3000, FAW J6P, Foton Auman GTL).
2. Click **View Specs** for deep technical details.
3. **Add to Quote**, adjust qty / unit price / add-ons (e.g. “Includes 1-Year Free Service + RTA Registration”).
4. Enter client details and click **Generate & Download PDF**.

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/trucks/` | List inventory |
| GET | `/api/trucks/{id}/` | Truck detail |
| POST | `/api/quotations/` | Create quotation (JSON) |
| GET | `/api/quotations/{id}/` | Quotation detail |
| GET | `/api/quotations/{id}/pdf/` | Download PDF for existing quote |
| POST | `/api/quotations/generate-pdf/` | Create quote + return PDF |

### Example PDF payload

```json
{
  "client_name": "Ahmed Al Maktoum",
  "company_name": "Desert Fleet Logistics LLC",
  "client_email": "fleet@desertlogistics.ae",
  "client_phone": "+971 50 123 4567",
  "items": [
    {
      "truck_id": 1,
      "quantity": 2,
      "unit_selling_price_aed": "165000.00",
      "custom_notes": "Includes 1-Year Free Service + RTA Registration"
    }
  ]
}
```

## Seeded inventory

| Brand | Model | Drive | Retail AED |
|-------|-------|-------|------------|
| Sinotruk | HOWO T7H 540HP 6x4 Tractor Head | 6×4 | 165,000 |
| Shacman | X3000 8x4 Heavy Duty Tipper | 8×4 | 180,000 |
| FAW | J6P 420HP 6x4 Tractor Head | 6×4 | 145,000 |
| Foton | Auman GTL 4x2 Logistics Flatbed | 4×2 | 120,000 |

Quote numbers auto-generate as `QT-2026-XXXX`. VAT is calculated at **5%** (UAE FTA). PDF validity is **15 days**.
