from django.contrib import admin       # <-- THIS IMPORT WAS MISSING
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/wallets/', include('wallets.urls')),
]
