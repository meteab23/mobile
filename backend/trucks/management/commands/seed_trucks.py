from decimal import Decimal

from django.core.management.base import BaseCommand

from trucks.models import Truck


TRUCKS = [
    {
        "brand": "Sinotruk",
        "model_name": "HOWO T7H 540HP 6x4 Tractor Head",
        "drive_type": "6x4",
        "horsepower": 540,
        "emission_standard": "Euro 5",
        "engine_model": "SINOTRUK MC13.54-50 Euro 5",
        "transmission": "HW25712XAC 12-Speed AMT",
        "specs": {
            "power_torque": "540 HP / 2500 Nm",
            "gross_weight_kg": 25000,
            "cabin": "High-Roof Double Sleeper with A/C",
            "fuel_tank": "600L Aluminum",
            "application": "Long-haul tractor head for UAE/GCC fleets",
            "axle": "Sinotruk dual-reduction drive axle",
            "brake_system": "Full air brake with ABS",
            "notes": "Popular on Dubai–Abu Dhabi–Riyadh corridor logistics fleets",
        },
        "fob_price_usd": Decimal("38500.00"),
        "landed_cost_aed": Decimal("148000.00"),
        "retail_price_aed": Decimal("165000.00"),
        "stock_vin_count": 7,
    },
    {
        "brand": "Shacman",
        "model_name": "X3000 8x4 Heavy Duty Tipper / Dump Truck",
        "drive_type": "8x4",
        "horsepower": 430,
        "emission_standard": "Euro 5",
        "engine_model": "Weichai WP12.430E50 Euro 5",
        "transmission": "FAST 12JSD200T Manual",
        "specs": {
            "power_torque": "430 HP",
            "axle": "Hande 16T MAN Dual Reduction",
            "cargo_box": "7600x2300x1500mm (U-Type)",
            "tires": "12.00R24 Heavy Mining Pattern",
            "application": "Aggregates, construction & quarry tipper duty",
            "cabin": "X3000 high-roof sleeper cabin",
            "brake_system": "Air brake, exhaust brake",
            "notes": "Preferred by UAE civil contractors and quarry operators",
        },
        "fob_price_usd": Decimal("42000.00"),
        "landed_cost_aed": Decimal("161000.00"),
        "retail_price_aed": Decimal("180000.00"),
        "stock_vin_count": 5,
    },
    {
        "brand": "FAW",
        "model_name": "J6P 420HP 6x4 Heavy Duty Tractor Head",
        "drive_type": "6x4",
        "horsepower": 420,
        "emission_standard": "Euro 4",
        "engine_model": "FAWDE CA6DM2-42E4 Euro 4",
        "transmission": "FAST 12-Speed with Retarder",
        "specs": {
            "power_torque": "420 HP",
            "drive": "6x4",
            "rear_axle_ratio": "4.111",
            "wheelbase": "3200+1350mm",
            "safety": "ABS, Air Seats, 360-degree camera",
            "cabin": "J6P high-roof sleeper",
            "application": "Regional haulage & container tractor work",
            "notes": "Strong value proposition for mid-size UAE fleet operators",
        },
        "fob_price_usd": Decimal("34000.00"),
        "landed_cost_aed": Decimal("130000.00"),
        "retail_price_aed": Decimal("145000.00"),
        "stock_vin_count": 9,
    },
    {
        "brand": "Foton",
        "model_name": "Auman GTL 4x2 Logistics Flatbed",
        "drive_type": "4x2",
        "horsepower": 330,
        "emission_standard": "Euro 5",
        "engine_model": "Cummins ISGe5-330 Euro 5",
        "transmission": "ZF 9-Speed Manual",
        "specs": {
            "power_torque": "330 HP",
            "payload_kg": 12000,
            "body_length": "6.8 Meters",
            "features": "Fleet Management Telematics, Cruise Control",
            "cabin": "GTL day/sleeper logistics cabin",
            "application": "Urban & inter-emirate flatbed distribution",
            "brake_system": "ABS with EBD",
            "notes": "Ideal last-mile / regional logistics for Dubai & Sharjah hubs",
        },
        "fob_price_usd": Decimal("28000.00"),
        "landed_cost_aed": Decimal("108000.00"),
        "retail_price_aed": Decimal("120000.00"),
        "stock_vin_count": 12,
    },
]


class Command(BaseCommand):
    help = "Seed the database with 4 hyper-realistic Chinese commercial trucks popular in the UAE/GCC market."

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for data in TRUCKS:
            truck, created = Truck.objects.update_or_create(
                brand=data["brand"],
                model_name=data["model_name"],
                defaults={
                    "drive_type": data["drive_type"],
                    "horsepower": data["horsepower"],
                    "emission_standard": data["emission_standard"],
                    "engine_model": data["engine_model"],
                    "transmission": data["transmission"],
                    "specs": data["specs"],
                    "fob_price_usd": data["fob_price_usd"],
                    "landed_cost_aed": data["landed_cost_aed"],
                    "retail_price_aed": data["retail_price_aed"],
                    "stock_vin_count": data["stock_vin_count"],
                },
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created: {truck}"))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f"Updated: {truck}"))

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete — {created_count} created, {updated_count} updated. "
                f"Total trucks: {Truck.objects.count()}"
            )
        )
