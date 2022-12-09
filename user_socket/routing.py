from game.consumers.multi.index import MultiPlayer as superperson
from Splendor.consumers.multi.index import MultiGameRoom as splendorroom
from django.urls import path

websocket_urlpatterns = [
        path('wss/superperson/multiplayer/', superperson.as_asgi(),name = "superperson_multi"),
        path('wss/splendor/multiplayer/room/', splendorroom.as_asgi(),name = "splendor_multi_room"),
]
