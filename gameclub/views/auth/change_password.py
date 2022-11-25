from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from gameclub.models.user_profile import UserProfile

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
        user_profiles = UserProfile.objects.filter(user__username = email)
        if user_profiles.exists():
            user_profile = user_profiles[0]
            user_profile.set_password(password)
            user_profile.save()
            return Response({
                'result': 'success',
            })
        else:
            return Response({
                'result': '邮箱账户不存在'
            })



