from game.consumers.multi.index import MultiPlayer
from django.urls import path

websocket_urlpatterns = [
        path('wss/superperson/multiplayer/', MultiPlayer.as_asgi(),name = "multiplayer"),
]
