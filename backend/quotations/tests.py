"""Unit tests for quotation business logic."""
from decimal import Decimal

import pytest
from django.contrib.auth import get_user_model

from customers.models import Customer
from quotations.models import Quotation, QuotationItem
from quotations.services import QuotationService
from trucks.models import Truck

User = get_user_model()


@pytest.fixture
def salesperson(db):
    return User.objects.create_user(
        username="tester",
        password="test123",
        role="salesperson",
        email="tester@example.com",
    )


@pytest.fixture
def customer(db):
    return Customer.objects.create(
        company_name="Test Transport LLC",
        trade_license="TL-TEST-001",
        vat_number="100000000000003",
        address="Test Address, Dubai",
        phone="+971 4 000 0000",
        email="test@example.com",
        contact_person="Test Person",
        payment_terms="net_30",
        credit_limit=Decimal("500000"),
    )


@pytest.fixture
def truck(db):
    return Truck.objects.create(
        brand="Shacman",
        model="X3000 Test",
        year=2024,
        category="tipper",
        horsepower=430,
        engine="Weichai WP12",
        transmission="Fast 12JS",
        drive_type="6x4",
        fuel="Diesel",
        emission="Euro 5",
        cab_type="High Roof",
        payload_kg=25000,
        gross_weight_kg=40000,
        wheelbase_mm=3800,
        dimensions="8450 x 2550 x 3450",
        fuel_tank_l=400,
        tyre_size="12.00R20",
        vin="LSYTEST000000001",
        engine_number="WPTEST00001",
        color="White",
        price=Decimal("182000"),
        cost=Decimal("145000"),
        stock_quantity=1,
        availability="available",
    )


@pytest.mark.django_db
def test_quotation_number_sequence(salesperson, customer, truck):
    q1 = QuotationService.create_quotation(
        salesperson=salesperson,
        customer_id=customer.id,
        items_data=[{"truck_id": truck.id, "quantity": 1}],
    )
    q2 = QuotationService.create_quotation(
        salesperson=salesperson,
        customer_id=customer.id,
        items_data=[{"truck_id": truck.id, "quantity": 1}],
    )
    assert q1.quotation_number.startswith("QT-")
    assert q2.quotation_number > q1.quotation_number


@pytest.mark.django_db
def test_line_total_and_vat(salesperson, customer, truck):
    q = QuotationService.create_quotation(
        salesperson=salesperson,
        customer_id=customer.id,
        items_data=[
            {
                "truck_id": truck.id,
                "quantity": 2,
                "unit_price": Decimal("100000"),
                "discount_percent": Decimal("10"),
            }
        ],
        discount_amount=Decimal("5000"),
    )
    # Line: 2 * 100000 = 200000, minus 10% = 180000
    item = q.items.first()
    assert item.line_total == Decimal("180000.00")
    assert q.subtotal == Decimal("180000.00")
    # Taxable = 180000 - 5000 = 175000; VAT 5% = 8750; Grand = 183750
    assert q.discount_amount == Decimal("5000.00")
    assert q.vat_amount == Decimal("8750.00")
    assert q.grand_total == Decimal("183750.00")


@pytest.mark.django_db
def test_change_status_converted_reserves_truck(salesperson, customer, truck):
    q = QuotationService.create_quotation(
        salesperson=salesperson,
        customer_id=customer.id,
        items_data=[{"truck_id": truck.id, "quantity": 1}],
        status="sent",
    )
    QuotationService.change_status(q, "converted")
    truck.refresh_from_db()
    assert q.status == "converted"
    assert truck.availability == "reserved"


@pytest.mark.django_db
def test_item_auto_description(salesperson, customer, truck):
    q = QuotationService.create_quotation(
        salesperson=salesperson,
        customer_id=customer.id,
        items_data=[{"truck_id": truck.id, "quantity": 1}],
    )
    item = q.items.first()
    assert truck.vin in item.description
    assert "430 HP" in item.description
