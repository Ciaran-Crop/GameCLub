from django.urls import path, include
from gameclub.views.page.register import RegisterView
from gameclub.views.page.span import SpanView
from gameclub.views.page.forget import ForgetView
from gameclub.views.page.bind import BindView

urlpatterns = [
        path('bind/', BindView.as_view(), name='bind_email'),
        path('register/', RegisterView.as_view(), name = 'register_page'),
        path('span/', SpanView.as_view(), name = 'span_page'),
        path('forget/', ForgetView.as_view(), name = 'forget_page'),
]
