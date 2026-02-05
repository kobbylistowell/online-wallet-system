from django.urls import path
from .views import register_view

urlpatterns = [
    path('register/', register_view, name='register'),
]



from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import register_view, login_view

urlpatterns = [
    path('register/', csrf_exempt(register_view), name='register'),
    path('login/', csrf_exempt(login_view), name='login'),
]
