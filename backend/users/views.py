from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer

@api_view(['POST'])
@authentication_classes([])  # no SessionAuthentication, so no CSRF check
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.contrib.auth import login as auth_login
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer

@api_view(['POST'])
@authentication_classes([])  # no SessionAuthentication, so no CSRF check on login
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.validated_data['user']
        auth_login(request, user)  # create session so dashboard API calls are authenticated
        get_token(request)  # ensure CSRF cookie is set
        return Response({
            "message": f"Welcome {user.username}!",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            "csrfToken": get_token(request),  # frontend sends this in X-CSRFToken header for POST
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
