"""
Seed realistic demo data for Gulf Heavy Trucks ERP.

Usage:
    python manage.py seed_demo
    python manage.py seed_demo --flush
"""
from datetime import timedelta
from decimal import Decimal
import random

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from customers.models import Customer
from inventory.models import InventoryUnit
from quotations.models import Quotation
from quotations.services import QuotationService, DEFAULT_TERMS
from trucks.models import Truck

User = get_user_model()

# Deterministic RNG for reproducible demos
RNG = random.Random(42)


USERS = [
    {
        "username": "admin",
        "password": "admin123",
        "first_name": "Omar",
        "last_name": "Al Maktoum",
        "email": "admin@gulfheavytrucks.ae",
        "role": "admin",
        "job_title": "Managing Director",
        "phone": "+971 50 111 0001",
        "avatar_color": "#0d47a1",
        "is_staff": True,
        "is_superuser": True,
    },
    {
        "username": "manager",
        "password": "manager123",
        "first_name": "Sara",
        "last_name": "Al Hashimi",
        "email": "sara.manager@gulfheavytrucks.ae",
        "role": "sales_manager",
        "job_title": "Sales Manager",
        "phone": "+971 50 222 0002",
        "avatar_color": "#1565c0",
    },
    {
        "username": "sales1",
        "password": "sales123",
        "first_name": "Ahmed",
        "last_name": "Hassan",
        "email": "ahmed.sales@gulfheavytrucks.ae",
        "role": "salesperson",
        "job_title": "Senior Sales Executive",
        "phone": "+971 50 333 0003",
        "avatar_color": "#0277bd",
    },
    {
        "username": "sales2",
        "password": "sales123",
        "first_name": "Fatima",
        "last_name": "Rahman",
        "email": "fatima.sales@gulfheavytrucks.ae",
        "role": "salesperson",
        "job_title": "Sales Executive",
        "phone": "+971 50 444 0004",
        "avatar_color": "#0288d1",
    },
    {
        "username": "viewer",
        "password": "viewer123",
        "first_name": "Khalid",
        "last_name": "Noor",
        "email": "viewer@gulfheavytrucks.ae",
        "role": "viewer",
        "job_title": "Operations Analyst",
        "phone": "+971 50 555 0005",
        "avatar_color": "#546e7a",
    },
]


CUSTOMERS = [
    ("ABC Transport LLC", "TL-7841001", "100111222300003", "Warehouse 4, Al Qusais Industrial, Dubai", "Dubai", "Dubai", "+971 4 261 1100", "fleet@abctransport.ae", "Rashid Al Suwaidi", "Fleet Manager", "net_30", 1500000),
    ("Gulf Logistics", "TL-7841002", "100222333400003", "Plot 22, Mussafah M-15, Abu Dhabi", "Abu Dhabi", "Abu Dhabi", "+971 2 555 2200", "ops@gulflogistics.ae", "Mohammed Al Kaabi", "Operations Director", "net_45", 2000000),
    ("Emirates Ready Mix", "TL-7841003", "100333444500003", "Jebel Ali Industrial Area 1, Dubai", "Dubai", "Dubai", "+971 4 880 3300", "procurement@emiratesreadymix.ae", "John Peters", "Procurement Head", "net_30", 2500000),
    ("National Contracting", "TL-7841004", "100444555600003", "ICAD 1, Mussafah, Abu Dhabi", "Abu Dhabi", "Abu Dhabi", "+971 2 412 4400", "tenders@nationalcontracting.ae", "Youssef Mansour", "Plant Manager", "lc", 3000000),
    ("Al Noor Transport", "TL-7841005", "100555666700003", "Industrial Area 6, Sharjah", "Sharjah", "Sharjah", "+971 6 534 5500", "info@alnoortransport.ae", "Hassan Al Noor", "Owner", "net_15", 800000),
    ("Desert Star Haulage", "TL-7841006", "100666777800003", "Al Sajaa Industrial, Sharjah", "Sharjah", "Sharjah", "+971 6 541 6600", "dispatch@desertstar.ae", "Ibrahim Qassim", "Dispatch Manager", "net_30", 1200000),
    ("Coastal Freight Services", "TL-7841007", "100777888900003", "Hamriyah Free Zone, Sharjah", "Sharjah", "Sharjah", "+971 6 526 7700", "sales@coastalfreight.ae", "Layla Al Marzouqi", "Commercial Manager", "net_60", 1800000),
    ("Falcon Aggregate Co.", "TL-7841008", "100888999000003", "Al Ain Industrial City, Al Ain", "Al Ain", "Abu Dhabi", "+971 3 721 8800", "orders@falconagg.ae", "Saeed Al Dhaheri", "Yard Supervisor", "net_30", 1000000),
    ("Union Concrete LLC", "TL-7841009", "100999000100003", "Dubai Investment Park 2, Dubai", "Dubai", "Dubai", "+971 4 885 9900", "fleet@unionconcrete.ae", "Peter Lang", "Fleet Controller", "net_45", 2200000),
    ("Al Futtaim Logistics", "TL-7841010", "101000111200003", "Al Quoz 4, Dubai", "Dubai", "Dubai", "+971 4 339 1010", "trucks@alfuttaimlog.ae", "Noura Al Futtaim", "Category Manager", "net_30", 5000000),
    ("Rimal Construction", "TL-7841011", "101111222300003", "Al Jurf Industrial, Ajman", "Ajman", "Ajman", "+971 6 748 1111", "plants@rimal.ae", "Omar Rimal", "CEO", "immediate", 600000),
    ("Peninsula Tankers", "TL-7841012", "101222333400003", "Jebel Ali Free Zone, Dubai", "Dubai", "Dubai", "+971 4 881 1212", "ops@peninsulatankers.ae", "David Chen", "Fleet Ops", "lc", 2800000),
    ("Oasis Heavy Haul", "TL-7841013", "101333444500003", "Ras Al Khor Industrial 2, Dubai", "Dubai", "Dubai", "+971 4 333 1313", "enquiries@oasisheavy.ae", "Majid Al Zaabi", "Sales Director", "net_30", 1600000),
    ("Barakah Mining Transport", "TL-7841014", "101444555600003", "Fujairah Industrial City, Fujairah", "Fujairah", "Fujairah", "+971 9 222 1414", "logistics@barakahmining.ae", "Ali Al Yammahi", "Logistics Head", "net_45", 1900000),
    ("Skyline Scaffolding & Haul", "TL-7841015", "101555666700003", "Al Muhaisnah 2, Dubai", "Dubai", "Dubai", "+971 4 264 1515", "admin@skylinescaffold.ae", "James Wright", "Operations", "net_15", 700000),
    ("Emirates Steel Logistics", "TL-7841016", "101666777800003", "ICAD III, Abu Dhabi", "Abu Dhabi", "Abu Dhabi", "+971 2 551 1616", "transport@emiratessteel.ae", "Hessa Al Mazrouei", "Transport Lead", "net_60", 3500000),
    ("Al Gharbia Contracting", "TL-7841017", "101777888900003", "Madinat Zayed, Al Dhafra", "Madinat Zayed", "Abu Dhabi", "+971 2 884 1717", "procurement@algharbia.ae", "Salem Al Mansoori", "Procurement", "net_30", 1400000),
    ("Horizon Ready Mix", "TL-7841018", "101888999000003", "Umm Al Quwain Industrial, UAQ", "Umm Al Quwain", "Umm Al Quwain", "+971 6 766 1818", "yard@horizonrmx.ae", "Karim Haddad", "Yard Manager", "net_30", 900000),
    ("Portside Cargo Movers", "TL-7841019", "101999000100003", "Port Rashid Area, Dubai", "Dubai", "Dubai", "+971 4 345 1919", "bookings@portsidecargo.ae", "Anita Sharma", "Booking Desk", "immediate", 500000),
    ("Tawheed Infrastructure", "TL-7841020", "102000111200003", "Khalifa Industrial Zone (KIZAD), Abu Dhabi", "Abu Dhabi", "Abu Dhabi", "+971 2 585 2020", "capex@tawheedinfra.ae", "Faisal Al Ketbi", "CapEx Manager", "lc", 4000000),
]


# (brand, model, year, category, hp, engine, transmission, drive, emission, cab, payload, gvw, wheelbase, dims, tank, tyre, color, price, cost, warranty, description)
TRUCK_SPECS = [
    ("Shacman", "X3000 Tipper 6x4", 2024, "tipper", 430, "Weichai WP12.430E50", "Fast 12JS180T", "6x4", "Euro 5", "X3000 High Roof", 25000, 40000, 3800, "8450 x 2550 x 3450", 400, "12.00R20", "Pearl White", 182000, 145000, "24 months / 200,000 km", "Flagship Shacman X3000 tipper popular with UAE ready-mix and quarry fleets. Robust chassis, Weichai power, and proven desert durability."),
    ("Shacman", "X3000 Tractor 6x4", 2024, "tractor", 430, "Weichai WP12.430E50", "Fast 12JS180T", "6x4", "Euro 5", "X3000 Sleeper", 0, 40000, 3200, "6980 x 2490 x 3560", 600, "12.00R20", "White/Blue", 195000, 155000, "24 months / 200,000 km", "Long-haul tractor head for container and flatbed trailers. High-roof sleeper cab with air suspension seat."),
    ("Shacman", "F3000 Tipper 8x4", 2023, "tipper", 380, "Weichai WP10.380E32", "Fast 10JSD180", "8x4", "Euro 5", "F3000 Day Cab", 32000, 50000, 4800, "9120 x 2550 x 3380", 400, "12.00R20", "Yellow", 168000, 132000, "12 months / 100,000 km", "Heavy 8x4 tipper for bulk aggregates. Value-oriented F3000 platform with strong aftersales support."),
    ("Shacman", "X5000 Cargo 6x4", 2025, "cargo", 460, "Weichai WP13.460E62", "Fast 12JZSD240", "6x4", "Euro 6", "X5000 High Roof", 18000, 40000, 4600, "9800 x 2550 x 3600", 600, "315/80R22.5", "Silver", 228000, 180000, "24 months / 200,000 km", "Next-gen X5000 cargo chassis with improved aerodynamics and Euro 6 compliance for free-zone operators."),
    ("Shacman", "L3000 Mixer 6x4", 2024, "mixer", 336, "Weichai WP10.336E53", "Fast 9JS150", "6x4", "Euro 5", "L3000 Day Cab", 10000, 31000, 4000, "8200 x 2500 x 3800", 300, "11.00R20", "White", 175000, 140000, "12 months / 100,000 km", "Concrete mixer chassis optimized for 8–10 m³ drums. Compact turning radius for congested sites."),
    ("Sinotruk HOWO", "TX Tipper 6x4", 2024, "tipper", 440, "MC13.44-50", "HW19710", "6x4", "Euro 5", "TX High Roof", 25000, 40000, 3825, "8550 x 2550 x 3500", 400, "12.00R20", "White", 195000, 152000, "24 months / 200,000 km", "HOWO TX tipper — market favorite for UAE construction. Strong MAN-derived MC13 engine and HW gearbox."),
    ("Sinotruk HOWO", "TX Tractor 6x4", 2024, "tractor", 440, "MC13.44-50", "HW19710", "6x4", "Euro 5", "TX Sleeper", 0, 40000, 3200, "6960 x 2496 x 3700", 600, "12.00R20", "White/Red", 205000, 160000, "24 months / 200,000 km", "Versatile TX tractor for 3-axle trailers. Popular with Gulf Logistics and coastal freight fleets."),
    ("Sinotruk HOWO", "T7H Tipper 8x4", 2025, "tipper", 480, "MC13.48-60", "HW25712X", "8x4", "Euro 6", "T7H Luxury", 32000, 50000, 5000, "9350 x 2550 x 3600", 400, "315/80R22.5", "Pearl White", 248000, 195000, "24 months / 250,000 km", "Premium T7H 8x4 tipper with luxury cab, advanced telematics, and Euro 6 aftertreatment."),
    ("Sinotruk HOWO", "A7 Cargo 6x2", 2023, "cargo", 380, "WD615.96E", "HW19710", "6x2", "Euro 5", "A7 Day Cab", 16000, 32000, 5600, "10500 x 2500 x 3400", 400, "11.00R20", "Blue", 158000, 125000, "12 months / 100,000 km", "Cost-effective A7 cargo for urban distribution and palletized goods."),
    ("Sinotruk HOWO", "TX Mixer 6x4", 2024, "mixer", 380, "MC11.38-50", "HW19710", "6x4", "Euro 5", "TX Day Cab", 10000, 31000, 4000, "8150 x 2500 x 3850", 300, "11.00R20", "White", 188000, 148000, "12 months / 100,000 km", "HOWO TX mixer chassis with PTO-ready gearbox for 9–10 m³ drums."),
    ("FAW", "JH6 Tipper 6x4", 2024, "tipper", 460, "CA6DM2-46E5", "CA12TAX210M", "6x4", "Euro 5", "JH6 High Roof", 25000, 40000, 3900, "8600 x 2550 x 3550", 400, "12.00R20", "White", 215000, 168000, "24 months / 200,000 km", "FAW JH6 460 HP tipper — refined cab comfort with competitive UAE pricing."),
    ("FAW", "JH6 Tractor 6x4", 2025, "tractor", 460, "CA6DM2-46E52", "CA12TAX210M", "6x4", "Euro 5", "JH6 Sleeper", 0, 40000, 3300, "7100 x 2495 x 3650", 600, "12.00R20", "Silver", 225000, 175000, "24 months / 200,000 km", "JH6 tractor head with spacious sleeper and strong residual value in GCC markets."),
    ("FAW", "J6P Tipper 8x4", 2023, "tipper", 420, "CA6DM2-42E5", "CA10TA160M", "8x4", "Euro 5", "J6P Day Cab", 32000, 50000, 4850, "9200 x 2550 x 3450", 400, "12.00R20", "Yellow", 198000, 155000, "12 months / 100,000 km", "Proven J6P 8x4 platform for quarry and crushing plant haulage."),
    ("FAW", "JH6 Tanker Chassis 6x4", 2024, "tanker", 420, "CA6DM2-42E5", "CA12TAX210M", "6x4", "Euro 5", "JH6 Day Cab", 18000, 40000, 4500, "9000 x 2500 x 3200", 400, "12.00R20", "White", 210000, 165000, "24 months / 200,000 km", "Tanker chassis prepared for fuel/water bodies — ideal for Peninsula Tankers-type fleets."),
    ("FAW", "JK6 Cargo 4x2", 2024, "cargo", 220, "CA4DD2-20E5", "CA6TAX100M", "4x2", "Euro 5", "JK6 Day Cab", 8000, 16000, 4700, "7800 x 2300 x 2800", 200, "8.25R20", "White", 98000, 78000, "12 months / 80,000 km", "Medium-duty JK6 for light logistics and municipal contracts."),
    ("Dongfeng", "KC Tipper 6x4", 2024, "tipper", 420, "Dongfeng DDi50E5", "DF12S160", "6x4", "Euro 5", "KC High Roof", 25000, 40000, 3800, "8400 x 2550 x 3480", 400, "12.00R20", "White", 178000, 140000, "12 months / 100,000 km", "Dongfeng KC tipper with competitive pricing for first-time fleet buyers."),
    ("Dongfeng", "KL Tractor 6x4", 2024, "tractor", 450, "Dongfeng DDi50E5", "DF12S180", "6x4", "Euro 5", "KL Sleeper", 0, 40000, 3300, "7000 x 2490 x 3600", 600, "12.00R20", "Blue/White", 192000, 150000, "24 months / 200,000 km", "KL series tractor with modern dash and reliable Cummins-derived powertrain options."),
    ("Dongfeng", "KC Mixer 6x4", 2023, "mixer", 375, "Dongfeng DDi50E5", "DF9S150", "6x4", "Euro 5", "KC Day Cab", 10000, 31000, 4000, "8100 x 2500 x 3780", 300, "11.00R20", "White", 165000, 130000, "12 months / 100,000 km", "Mixer-ready KC chassis widely used by Emirates Ready Mix contractors."),
    ("Dongfeng", "Tianlong Cargo 6x4", 2025, "cargo", 460, "Dongfeng DDi75E6", "DF12S240", "6x4", "Euro 6", "Tianlong High Roof", 18000, 40000, 4700, "9900 x 2550 x 3580", 600, "315/80R22.5", "Silver", 235000, 185000, "24 months / 200,000 km", "Premium Tianlong cargo for long-body dry van and refrigerated applications."),
    ("Dongfeng", "KC Flatbed 6x4", 2024, "flatbed", 375, "Dongfeng DDi50E5", "DF9S150", "6x4", "Euro 5", "KC Day Cab", 20000, 40000, 4500, "9500 x 2500 x 3100", 400, "12.00R20", "Red", 155000, 122000, "12 months / 100,000 km", "Flatbed chassis for steel, pipe, and prefab panel transport."),
    ("Foton", "Auman EST Tipper 6x4", 2024, "tipper", 430, "Cummins ISG12 430", "ZF TraXon 12TX2420", "6x4", "Euro 5", "EST High Roof", 25000, 40000, 3850, "8500 x 2550 x 3520", 400, "12.00R20", "White", 208000, 162000, "24 months / 200,000 km", "Foton Auman EST with Cummins + ZF package — European-grade driveline feel."),
    ("Foton", "Auman EST Tractor 6x4", 2025, "tractor", 470, "Cummins ISG12 470", "ZF TraXon 12TX2620", "6x4", "Euro 6", "EST Sleeper", 0, 40000, 3300, "7050 x 2495 x 3680", 600, "315/80R22.5", "Pearl White", 255000, 200000, "24 months / 250,000 km", "Top-spec EST tractor for premium long-haul operators seeking Euro 6 compliance."),
    ("Foton", "GTL Cargo 6x2", 2023, "cargo", 350, "Cummins ISL8.9 350", "ZF 9S1310", "6x2", "Euro 5", "GTL Day Cab", 14000, 28000, 5500, "10200 x 2500 x 3350", 400, "11.00R20", "White", 148000, 118000, "12 months / 100,000 km", "GTL mid-range cargo for regional distribution between emirates."),
    ("Foton", "Auman Mixer 6x4", 2024, "mixer", 380, "Cummins ISL8.9 380", "ZF 9S1310", "6x4", "Euro 5", "EST Day Cab", 10000, 31000, 4000, "8180 x 2500 x 3820", 300, "11.00R20", "White", 198000, 155000, "12 months / 100,000 km", "Auman mixer chassis preferred by Union Concrete for reliability."),
    ("Foton", "Auman EST Tanker 6x4", 2024, "tanker", 430, "Cummins ISG12 430", "ZF TraXon 12TX2420", "6x4", "Euro 5", "EST Day Cab", 18000, 40000, 4500, "9050 x 2500 x 3180", 400, "12.00R20", "White", 218000, 170000, "24 months / 200,000 km", "Tanker-ready EST chassis with strong braking package for liquid haulage."),
    ("JAC", "Gallop Tipper 6x4", 2024, "tipper", 400, "Cummins ISLe 400", "Fast 10JSD160", "6x4", "Euro 5", "Gallop High Roof", 24000, 40000, 3800, "8350 x 2550 x 3450", 400, "12.00R20", "White", 165000, 128000, "12 months / 100,000 km", "JAC Gallop tipper — competitive entry into Chinese heavy tippers for UAE SMEs."),
    ("JAC", "Gallop Tractor 6x4", 2024, "tractor", 420, "Cummins ISLe 420", "Fast 12JS180T", "6x4", "Euro 5", "Gallop Sleeper", 0, 40000, 3200, "6900 x 2490 x 3550", 500, "12.00R20", "Blue", 172000, 135000, "12 months / 100,000 km", "Affordable tractor head for short to medium-haul trailer work."),
    ("JAC", "N Series Cargo 4x2", 2025, "cargo", 190, "JAC HFC4DE1-1D", "JAC 6-speed", "4x2", "Euro 5", "N Series Day Cab", 6000, 12000, 3800, "6800 x 2200 x 2650", 150, "7.50R16", "White", 78000, 62000, "12 months / 60,000 km", "Light commercial N-series for last-mile and municipal logistics."),
    ("JAC", "Gallop Flatbed 6x4", 2023, "flatbed", 380, "Cummins ISLe 380", "Fast 9JS150", "6x4", "Euro 5", "Gallop Day Cab", 20000, 40000, 4500, "9400 x 2500 x 3050", 400, "12.00R20", "Red", 142000, 112000, "12 months / 100,000 km", "Flatbed Gallop for rebar and construction materials across emirates."),
    ("JAC", "Gallop Mixer 6x4", 2024, "mixer", 350, "Cummins ISLe 350", "Fast 9JS150", "6x4", "Euro 5", "Gallop Day Cab", 10000, 31000, 4000, "8050 x 2500 x 3750", 300, "11.00R20", "White", 158000, 125000, "12 months / 100,000 km", "Mixer chassis aimed at mid-size ready-mix operators seeking lower CapEx."),
]


WAREHOUSES = ["Al Quoz Yard A", "Al Quoz Yard B", "Jebel Ali Bonded", "Sharjah Staging Yard"]
COLORS_EXTRA = ["White", "Pearl White", "Yellow", "Blue", "Silver", "Red"]


def make_vin(wmi: str, year: int, seq: int) -> str:
    """Generate a plausible 17-char VIN (not checksum-validated, demo only)."""
    year_codes = {
        2023: "P",
        2024: "R",
        2025: "S",
    }
    y = year_codes.get(year, "R")
    # VIN: 3 WMI + 5 VDS + 1 check + 1 year + 1 plant + 6 serial
    vds = f"TRK{seq % 100:02d}A"
    plant = "D"  # Dubai import marking
    serial = f"{seq:06d}"
    check = "X"
    return f"{wmi}{vds}{check}{y}{plant}{serial}"[:17]


WMI_MAP = {
    "Shacman": "LSY",
    "Sinotruk HOWO": "LZZ",
    "FAW": "LFW",
    "Dongfeng": "LGA",
    "Foton": "LVB",
    "JAC": "LJ1",
}


def make_engine_number(brand: str, seq: int) -> str:
    prefixes = {
        "Shacman": "WP",
        "Sinotruk HOWO": "MC",
        "FAW": "CA",
        "Dongfeng": "DD",
        "Foton": "CM",
        "JAC": "JC",
    }
    return f"{prefixes.get(brand, 'EN')}{2024}{seq:05d}AE"


class Command(BaseCommand):
    help = "Seed demo users, trucks, customers, inventory, and quotations"

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Delete existing demo data before seeding",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options["flush"]:
            self.stdout.write("Flushing existing data…")
            Quotation.objects.all().delete()
            InventoryUnit.objects.all().delete()
            Truck.objects.all().delete()
            Customer.objects.all().delete()
            User.objects.exclude(username="admin").filter(
                username__in=[u["username"] for u in USERS]
            ).delete()

        self.stdout.write("Seeding users…")
        users = self._seed_users()

        self.stdout.write("Seeding customers…")
        customers = self._seed_customers()

        self.stdout.write("Seeding trucks & inventory…")
        trucks = self._seed_trucks()

        self.stdout.write("Seeding quotations…")
        self._seed_quotations(users, customers, trucks)

        self.stdout.write(self.style.SUCCESS(
            f"Done. Users={User.objects.count()}, Trucks={Truck.objects.count()}, "
            f"Customers={Customer.objects.count()}, Quotations={Quotation.objects.count()}, "
            f"Inventory={InventoryUnit.objects.count()}"
        ))
        self.stdout.write("Demo logins: admin/admin123, manager/manager123, sales1/sales123, sales2/sales123, viewer/viewer123")

    def _seed_users(self):
        created = {}
        for data in USERS:
            defaults = {k: v for k, v in data.items() if k not in ("username", "password")}
            user, was_created = User.objects.get_or_create(
                username=data["username"],
                defaults=defaults,
            )
            if was_created or not user.check_password(data["password"]):
                user.set_password(data["password"])
                for k, v in defaults.items():
                    setattr(user, k, v)
                user.save()
            created[data["username"]] = user
        return created

    def _seed_customers(self):
        customers = []
        for row in CUSTOMERS:
            (
                name, tl, vat, address, city, emirate, phone, email,
                contact, title, terms, credit,
            ) = row
            obj, _ = Customer.objects.update_or_create(
                trade_license=tl,
                defaults={
                    "company_name": name,
                    "vat_number": vat,
                    "address": address,
                    "city": city,
                    "emirate": emirate,
                    "phone": phone,
                    "email": email,
                    "contact_person": contact,
                    "contact_title": title,
                    "payment_terms": terms,
                    "credit_limit": Decimal(credit),
                    "is_active": True,
                },
            )
            customers.append(obj)
        return customers

    def _seed_trucks(self):
        trucks = []
        availabilities = (
            ["available"] * 16
            + ["reserved"] * 5
            + ["sold"] * 5
            + ["in_transit"] * 4
        )
        RNG.shuffle(availabilities)

        for idx, spec in enumerate(TRUCK_SPECS, start=1):
            (
                brand, model, year, category, hp, engine, transmission, drive,
                emission, cab, payload, gvw, wheelbase, dims, tank, tyre,
                color, price, cost, warranty, description,
            ) = spec
            vin = make_vin(WMI_MAP[brand], year, idx)
            engine_no = make_engine_number(brand, idx)
            availability = availabilities[idx - 1]
            warehouse = RNG.choice(WAREHOUSES)
            # Placeholder images — brand-colored Unsplash truck photos
            image_url = f"https://picsum.photos/seed/truck{idx}/800/500"

            truck, _ = Truck.objects.update_or_create(
                vin=vin,
                defaults={
                    "brand": brand,
                    "model": model,
                    "year": year,
                    "category": category,
                    "horsepower": hp,
                    "engine": engine,
                    "transmission": transmission,
                    "drive_type": drive,
                    "fuel": "Diesel",
                    "emission": emission,
                    "cab_type": cab,
                    "payload_kg": payload,
                    "gross_weight_kg": gvw,
                    "wheelbase_mm": wheelbase,
                    "dimensions": dims,
                    "fuel_tank_l": tank,
                    "tyre_size": tyre,
                    "engine_number": engine_no,
                    "color": color,
                    "price": Decimal(price),
                    "cost": Decimal(cost),
                    "stock_quantity": 0 if availability == "sold" else 1,
                    "availability": availability,
                    "image_url": image_url,
                    "description": description,
                    "warranty": warranty,
                    "warehouse": warehouse,
                },
            )
            InventoryUnit.objects.update_or_create(
                truck=truck,
                defaults={
                    "vin": vin,
                    "engine_number": engine_no,
                    "purchase_cost": Decimal(cost),
                    "selling_price": Decimal(price),
                    "status": availability,
                    "warehouse": warehouse,
                    "location_bay": f"Bay-{idx:02d}",
                    "arrival_date": timezone.localdate() - timedelta(days=RNG.randint(10, 180)),
                },
            )
            trucks.append(truck)
        return trucks

    def _seed_quotations(self, users, customers, trucks):
        if Quotation.objects.count() >= 15:
            return

        salespeople = [users["sales1"], users["sales2"], users["manager"]]
        statuses = [
            "draft", "draft",
            "sent", "sent", "sent",
            "approved", "approved", "approved",
            "rejected",
            "converted", "converted",
            "sent", "approved", "draft", "converted",
        ]
        available_trucks = [t for t in trucks if t.availability in ("available", "reserved")]
        all_trucks = list(trucks)

        today = timezone.localdate()

        for i, status in enumerate(statuses):
            customer = customers[i % len(customers)]
            salesperson = salespeople[i % len(salespeople)]
            # Put approved/converted quotes in the current month for dashboard KPIs
            if status in ("approved", "converted") or i < 4:
                day_offset = min(i % max(today.day, 1), max(today.day - 1, 0))
                quote_date = today - timedelta(days=day_offset)
            else:
                quote_date = today - timedelta(days=RNG.randint(20, 90))
            # 1–3 line items
            n_items = RNG.randint(1, 3)
            pool = available_trucks if status != "converted" else all_trucks
            chosen = RNG.sample(pool, k=min(n_items, len(pool)))
            items_data = []
            for t in chosen:
                disc = Decimal(RNG.choice([0, 0, 2, 3, 5]))
                items_data.append(
                    {
                        "truck_id": t.id,
                        "quantity": 1,
                        "unit_price": t.price,
                        "discount_percent": disc,
                    }
                )
            notes = RNG.choice([
                "Price includes pre-delivery inspection and UAE registration assistance.",
                "Delivery to customer yard within Dubai included. Outside Dubai quoted separately.",
                "Customer requested additional reverse camera and GPS — optional extras quoted on request.",
                "Volume pricing applied for multi-unit enquiry.",
                "",
            ])
            header_disc = Decimal(RNG.choice([0, 0, 0, 5000, 10000]))
            QuotationService.create_quotation(
                salesperson=salesperson,
                customer_id=customer.id,
                items_data=items_data,
                validity_days=RNG.choice([15, 30, 30, 45]),
                discount_amount=header_disc,
                notes=notes,
                terms_and_conditions=DEFAULT_TERMS,
                status=status,
                date=quote_date,
            )
