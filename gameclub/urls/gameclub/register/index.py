from django.urls import path, include
from gameclub.views.register.register import RegisterView
from gameclub.views.register.send_email import SendEmail
from gameclub.views.register.signup import SignUp

urlpatterns = [
    path('register/', RegisterView.as_view(), name = 'register__page'),
    path('send_email/', SendEmail.as_view(), name = 'send_email'),
    path('signup/', SignUp.as_view(), name = 'signup'),
]
