from rest_framework.views import APIView
from rest_framework.response import Response
from game.models.player import Player
from django.contrib.auth.models import User

class RegisterView(APIView):
    def post(self, request):
        data = request.POST
        username = data.get('username').strip()
        password = data.get('password').strip()
        password_confirm = data.get('password_confirm').strip()
        if username == '':
            return Response({
                'result': 'false',
                'text' : '用户名不能为空',
                })
        if password == '':
            return Response({
                'result': 'false',
                'text': '密码不能为空',
                })
        if password_confirm == '':
            return Response({
                'result': 'false',
                'text': '请再次输入密码',
                })
        if password_confirm != password:
            return Response({
                'result': 'false',
                'text': '密码不一致',
                })
        if User.objects.filter(username=username).exists():
            return Response({
                'result': 'false',
                'text': '用户名已存在',
                })
        user = User.objects.create_user(username=username, password=password)
        user.save()
        player = Player.objects.create(user=user, photo='https://bkimg.cdn.bcebos.com/pic/2f738bd4b31c8701a18b454f1f2a892f070828385146', back_img='https://app3774.acapp.acwing.com.cn/static/superperson/images/menu/hakase.jpg')

        return Response({
            'result': 'success',
            'text': '',
            })


