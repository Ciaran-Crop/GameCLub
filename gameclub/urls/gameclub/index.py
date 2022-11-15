from django.urls import path, include

urlpatterns = [
    path('jwt/', include('gameclub.urls.gameclub.jwt.index'), name = 'jwt'),
    path('home/', include('gameclub.urls.gameclub.home.index'), name = 'home'),
    path('settings/', include('gameclub.urls.gameclub.settings.index'), name = 'settings'),
    path('register/', include('gameclub.urls.gameclub.register.index'), name = 'register'),
    path('forget/', include('gameclub.urls.gameclub.forget.index'), name = 'forget'),
    path('third_login/', include('gameclub.urls.gameclub.third_login.index'), name = 'third_login'),
]
