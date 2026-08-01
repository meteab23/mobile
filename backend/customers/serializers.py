from rest_framework import serializers

from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    payment_terms_display = serializers.CharField(
        source="get_payment_terms_display", read_only=True
    )
    quotations_count = serializers.IntegerField(source="quotations.count", read_only=True)

    class Meta:
        model = Customer
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at")
