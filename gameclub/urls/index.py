from django.urls import path, include
from gameclub.views.page.index import IndexView

urlpatterns = [
    path('', IndexView.as_view(), name = 'index_html'),
    path('gameclub/', include('gameclub.urls.gameclub.index'),name = 'gameclub')
]
