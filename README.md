# Gulf Heavy Trucks — Dealership ERP

Production-quality demo ERP for a UAE truck dealership that imports Chinese heavy trucks and sells them to B2B customers.

**Stack:** Django 5 + DRF + SimpleJWT + PostgreSQL + WeasyPrint · React 19 + TypeScript + Vite + MUI + React Query

---

## Features

- Role-based auth (Admin, Sales Manager, Salesperson, Viewer)
- Dashboard with KPIs and charts
- Truck catalog (~30 units) with search, filter, sort, pagination
- Customers (~20 UAE companies)
- Sales quotations with multi-line items, VAT, status workflow
- Premium multi-page PDF quotations (WeasyPrint)
- Inventory tracking (Available / Reserved / Sold / In Transit)
- Global search (VIN, truck, customer, quotation)
- Dark / light mode, responsive ERP UI

---

## Quick start

### Prerequisites

- Python 3.12+
- Node.js 20+
- PostgreSQL 14+

### 1. Database

```bash
sudo service postgresql start
sudo -u postgres psql -c "CREATE USER truckerp WITH PASSWORD 'truckerp' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE truckerp OWNER truckerp;"
```

### 2. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # or use the provided .env
python manage.py migrate
python manage.py seed_demo
python manage.py runserver 0.0.0.0:8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

---

## Demo logins

| Username  | Password    | Role           |
|-----------|-------------|----------------|
| admin     | admin123    | Admin          |
| manager   | manager123  | Sales Manager  |
| sales1    | sales123    | Salesperson    |
| sales2    | sales123    | Salesperson    |
| viewer    | viewer123   | Viewer         |

---

## Seed data

`python manage.py seed_demo` creates:

- 5 users
- 30 trucks (Shacman, HOWO, FAW, Dongfeng, Foton, JAC)
- 20 customers
- 15 quotations
- 30 inventory units

Re-seed with `python manage.py seed_demo --flush`.

---

## API overview

| Area        | Base path            |
|-------------|----------------------|
| Auth        | `/api/auth/`         |
| Dashboard   | `/api/dashboard/`    |
| Trucks      | `/api/trucks/`       |
| Customers   | `/api/customers/`    |
| Quotations  | `/api/quotations/`   |
| PDF         | `/api/quotations/{id}/pdf/` |
| Inventory   | `/api/inventory/`    |
| Search      | `/api/search/?q=`    |

JWT: `Authorization: Bearer <access_token>`

---

## Tests

```bash
cd backend
source .venv/bin/activate
pytest quotations/tests.py -q
```

---

## Project structure

```
backend/
  accounts/          # Users, JWT login, seed command
  trucks/            # Truck catalog
  customers/         # B2B customers
  quotations/        # Quotations, services, PDF
  inventory/         # Per-VIN inventory units
  dashboard/         # KPIs & chart aggregates
  search/            # Global search
  templates/pdf/     # Quotation HTML/CSS for WeasyPrint
frontend/
  src/api/           # Axios client & endpoints
  src/pages/         # Route screens
  src/components/    # Layout, tables, stats
  src/contexts/      # Auth & theme
```

---

## Company (demo)

**Gulf Heavy Trucks Trading LLC** — Al Quoz Industrial Area 3, Dubai, UAE · Currency AED · VAT 5%
