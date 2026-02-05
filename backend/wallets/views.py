from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Wallet
from .serializers import WalletSerializer, DepositWithdrawSerializer
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer


def get_or_create_wallet(user):
    wallet, _ = Wallet.objects.get_or_create(user=user, defaults={"balance": 0})
    return wallet


@api_view(["GET"])
def balance_view(request):
    wallet = get_or_create_wallet(request.user)
    serializer = WalletSerializer(wallet)
    return Response(serializer.data)


@api_view(["POST"])
def deposit_view(request):
    wallet = get_or_create_wallet(request.user)
    serializer = DepositWithdrawSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    amount = serializer.validated_data["amount"]
    description = serializer.validated_data.get("description", "Deposit")
    wallet.balance += amount
    wallet.save(update_fields=["balance", "updated_at"])
    Transaction.objects.create(
        wallet=wallet,
        type=Transaction.Type.DEPOSIT,
        amount=amount,
        description=description or "Deposit",
    )
    return Response(
        {"message": "Deposit successful", "balance": str(wallet.balance)},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def withdraw_view(request):
    wallet = get_or_create_wallet(request.user)
    serializer = DepositWithdrawSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    amount = serializer.validated_data["amount"]
    description = serializer.validated_data.get("description", "Withdrawal")
    if wallet.balance < amount:
        return Response(
            {"error": "Insufficient balance"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    wallet.balance -= amount
    wallet.save(update_fields=["balance", "updated_at"])
    Transaction.objects.create(
        wallet=wallet,
        type=Transaction.Type.WITHDRAWAL,
        amount=amount,
        description=description or "Withdrawal",
    )
    return Response(
        {"message": "Withdrawal successful", "balance": str(wallet.balance)},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def transactions_view(request):
    wallet = get_or_create_wallet(request.user)
    qs = wallet.transactions.all()[:20]
    serializer = TransactionSerializer(qs, many=True)
    return Response(serializer.data)
