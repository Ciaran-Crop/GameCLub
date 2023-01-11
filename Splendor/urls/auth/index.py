from django.urls import path, include
from Splendor.views.auth.get_info import PlayerInfo
from Splendor.views.auth.get_ranklist import RankListInfo
from Splendor.views.auth.acwing import ApplyCode, ReceiveCode

urlpatterns = [
    path('get_info/',PlayerInfo.as_view() , name = 'splendor_get_info'),
    path('get_ranklist/',RankListInfo.as_view() , name = 'splendor_get_ranklist'),
    path('apply_code/', ApplyCode.as_view(), name='splendor_acwing_login'),
    path('receive_code/', ReceiveCode.as_view(), name='splendor_acwing_refresh'),
]
