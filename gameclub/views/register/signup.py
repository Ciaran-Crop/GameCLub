from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.core.cache import cache
from rest_framework_simplejwt.tokens import RefreshToken
from gameclub.views.common import BASE_URL

class SignUp(APIView):
    def post(self, request):
        data = request.POST
        name = data['name']
        email = data['email']
        password = data['password']
        confirm = data['confirm']
        state = cache.get(email + '-' + confirm)
        if not state:
            return Response({
                'result': '验证码错误',
            })
        user = User.objects.create_user(username=email, first_name = name, password = password)
        user.save()
        token = RefreshToken.for_user(user = user)
        return Response({
                'result': 'success',
                'url' : BASE_URL + "?access=" + str(token.access_token) + "&refresh=" + str(token),
            })
