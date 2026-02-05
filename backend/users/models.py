from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, unique=True, default='0000000000')


    USERNAME_FIELD = 'email'  # This tells Django to use email for login
    REQUIRED_FIELDS = ['username']  # required when creating superusers
