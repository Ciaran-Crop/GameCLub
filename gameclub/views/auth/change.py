from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from gameclub.models.user_profile import UserProfile
from gameclub.models.user_game import UserGameInfo
from gameclub.models.game import GameInfo
from django.core.cache import cache

class ChangeView(APIView):
    permission_classes = [(IsAuthenticated)]

    def post(self, request):
        data = request.POST
        if data['type'] == 'name':
            return self.change_name(data, request.user)
        elif data['type'] == 'email':
            return self.change_email(data, request.user)
        elif data['type'] == 'photo':
            return self.change_photo(data, request)
        elif data['type'] == 'back':
            return self.change_back(data, request)

    def change_photo(self, data, request):
        user = request.user
        photo_file = request.FILES.get('file')
        print(photo_file)

        user_profile = UserProfile.objects.get(user = request.user)

        state = user_profile.set_photo(photo_file)
        if state:
            return self.success()
        else:
            return self.error('上传失败')

    def change_back(self, data, request):
        user = request.user
        back_file = request.FILES.get('file')

        user_profile = UserProfile.objects.get(user = request.user)

        state = user_profile.set_back(back_file)

        if state:
            return self.success()
        else:
            return self.error('上传失败')


    def change_email(self, data, user):
        validate = data['validate']
        email = data['email']
        state = cache.get(email + '-' + validate)
        if not state:
            return self.error('验证码错误')

        cache.delete(email + '-' + validate)
        user_profile = UserProfile.objects.get(user = user)
        user_profile.set_email(email)
        return self.success()

    def change_name(self, data, user):
        name = data['name']
        user_profile = UserProfile.objects.get(user = user)
        user_profile.set_name(name)
        return self.success()

    def success(self):
        return Response({
            'result': 'success'
        })

    def error(self, text):
        return Response({
            'result': text,
        })
