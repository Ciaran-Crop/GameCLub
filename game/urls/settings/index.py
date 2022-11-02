from django.urls import path, include
from game.views.settings.get_info import get_info
from game.views.settings.user_login import user_login, user_logout, user_register

urlpatterns = [
        path('get_info/', get_info, name = 'get_info'),
        path('user_login/', user_login, name='user_login'),
        path('user_logout/', user_logout, name='user_logout'),
        path('user_register/', user_register, name='user_register'),
        path('web/', include('game.urls.settings.web.index')),
        path('acwing/', include('game.urls.settings.acwing.index')),
        ]
