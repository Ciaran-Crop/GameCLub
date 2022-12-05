from django.urls import path, include
from Splendor.views.page.signin import LoginPage

urlpatterns = [
    path('', LoginPage.as_view(), name='splendor_index'),
    path('page/', include('Splendor.urls.page.index'), name='splendor_pages'),
    path('auth/', include('Splendor.urls.auth.index'), name='splendor_auth'),
]
