from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.core.cache import cache

class ChangePassword(APIView):
    def post(self, request):
        data = request.POST
        email = data['email']
        validate = data['validate']
        password = data['password']
        state = cache.get(email + '-' + validate)
        if not state:
            return Response({
                'result': '验证码错误',
            })
        cache.delete(email + '-' + validate)
        user = User.objects.get(username = email)
        user.set_password(password)
        user.save()
        return Response({
            'result': 'success',
        })



