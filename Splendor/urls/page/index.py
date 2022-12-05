from django.urls import path, include
from Splendor.views.page.menu import MenuPage
from Splendor.views.page.signin import LoginPage

urlpatterns = [
    path('menu/', MenuPage.as_view(), name='splendor_menu'),
    path('signin/', LoginPage.as_view(), name='splendor_login'),
]
