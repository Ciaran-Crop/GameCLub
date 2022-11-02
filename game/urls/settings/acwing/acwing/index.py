from django.urls import path
from game.views.settings.acwing_acwing import apply_code, receive_code

urlpatterns = [
    path('apply_code/', apply_code, name='acwing_apply_code'),
    path('receive_code/', receive_code, name='acwing_receive_code'),
]
