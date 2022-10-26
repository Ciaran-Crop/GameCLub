from django.urls import path, include
from game.views.index import index


urlpatterns = [
    path("", index, name='superperson-index'),
    path("menu/", include('game.urls.menu.index')),
    path("settings/", include('game.urls.settings.index')),
    path("playground", include('game.urls.playground.index')),
]
