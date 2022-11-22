from django.urls import path, include

urlpatterns = [
    path('settings/', include('gameclub.urls.gameclub.settings.index'), name = 'settings'),
    path('auth/', include('gameclub.urls.gameclub.auth.index'), name = 'auth_methods'),
    path('page/', include('gameclub.urls.gameclub.page.index'), name = 'page_methods'),
]
