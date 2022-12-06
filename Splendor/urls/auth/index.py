from django.urls import path, include
from Splendor.views.auth.get_info import PlayerInfo
from Splendor.views.auth.get_ranklist import RankListInfo

urlpatterns = [
    path('get_info/',PlayerInfo.as_view() , name = 'splendor_get_info'),
    path('get_ranklist/',RankListInfo.as_view() , name = 'splendor_get_ranklist'),
]
