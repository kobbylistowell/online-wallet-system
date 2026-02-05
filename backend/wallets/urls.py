from django.urls import path
from . import views

urlpatterns = [
    path("balance/", views.balance_view),
    path("deposit/", views.deposit_view),
    path("withdraw/", views.withdraw_view),
    path("transactions/", views.transactions_view),
]
