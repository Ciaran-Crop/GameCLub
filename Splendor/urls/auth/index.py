from django.urls import path, include
from Splendor.views.auth.get_info import PlayerInfo

urlpatterns = [
    path('get_info/',PlayerInfo.as_view() , name = 'splendor_get_info'),
]
