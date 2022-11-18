from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView
)


urlpatterns = [
        path('token/',TokenObtainPairView.as_view() , name = 'access token'),
        path('token/refresh/',TokenRefreshView.as_view(), name = 'refresh token'),
]
