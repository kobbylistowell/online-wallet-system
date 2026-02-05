from decimal import Decimal
from rest_framework import serializers
from .models import Wallet


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ["id", "balance", "currency", "created_at"]
        read_only_fields = fields


class DepositWithdrawSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=14, decimal_places=2, min_value=Decimal("0.01"))
    description = serializers.CharField(max_length=255, required=False, default="")
