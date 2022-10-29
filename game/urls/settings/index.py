from django.urls import path
from game.views.settings.get_info import get_info


urlpatterns = [
    path('get_info/', get_info, name = 'get_info'),
        ]
