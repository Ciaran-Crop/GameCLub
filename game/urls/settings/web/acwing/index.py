from django.urls import path
from game.views.settings.web_acwing import apply_code, receive_code

urlpatterns = [
    path('apply_code/', apply_code, name='apply_code'),
    path('receive_code/', receive_code, name='receive_code'),
]
