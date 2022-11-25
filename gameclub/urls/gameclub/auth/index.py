from django.urls import path, include
from gameclub.views.auth.getinfo import InfoView
from gameclub.views.auth.check import CheckView
from gameclub.views.auth.send_email import SendEmail
from gameclub.views.auth.signup import SignUp
from gameclub.views.auth.change_password import ChangePassword
from gameclub.views.auth.change import ChangeView


urlpatterns = [
        path('change/', ChangeView.as_view(), name='change_info'),
        path('jwt/',include('gameclub.urls.gameclub.auth.jwt.index'), name = 'refresh_token'),
        path('third_login/',include('gameclub.urls.gameclub.auth.third_login.index'), name = 'third_login'),
        path('get_info/', InfoView.as_view(), name="user_info"),
        path('check/', CheckView.as_view(), name="user_auth_check"),
        path('send_email/', SendEmail.as_view(), name = 'send_email'),
        path('signup/', SignUp.as_view(), name = 'signup'),
        path('change_password/', ChangePassword.as_view(), name='change_password'),
]
