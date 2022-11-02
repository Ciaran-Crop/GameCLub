from django.urls import path, include

urlpatterns = [
        path('acwing/', include('game.urls.settings.acwing.acwing.index')),
]
