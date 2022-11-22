from django.urls import path, include
from gameclub.views.auth.acwing_login import ApplyCode, ReceiveCode

urlpatterns = [
    path('apply_code/', ApplyCode.as_view(), name="acwing_apply_code"),
    path('receive_code/', ReceiveCode.as_view(), name="acwing_receive_code"),
]
