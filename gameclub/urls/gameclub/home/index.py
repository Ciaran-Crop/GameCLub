from django.urls import path, include
from gameclub.views.home.span import SpanView
from gameclub.views.home.getinfo import InfoView
from gameclub.views.home.check import CheckView

urlpatterns = [
    path('span/', SpanView.as_view(), name="user_span"),
    path('get_info/', InfoView.as_view(), name="user_info"),
    path('check/', CheckView.as_view(), name="user_auth_check"),
]
