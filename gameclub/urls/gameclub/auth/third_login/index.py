from django.urls import path, include

urlpatterns = [
    path('acwing/', include('gameclub.urls.gameclub.auth.third_login.acwing.index'), name="acwing_login"),
]
