from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.contrib.auth.models import User
from game.models.player import Player

def user_login(request):
    if request.method == 'POST':
        data = request.POST
        username = data.get('username').strip();
        password = data.get('password').strip();
        if username == '':
            return JsonResponse({
                'result': 'false',
                'text': '用户名不能为空',
                })
        if password == '':
            return JsonResponse({
                'result': 'false',
                'text': '密码不能为空',
                })
        user = authenticate(request, username=username, password=password)
        if not user:
            return JsonResponse({
                'result': 'false',
                'text': '用户名或密码不正确',
            })
        login(request,user)
        return JsonResponse({
            'result': 'success',
            'text': '登录成功',
        })
    else:
        return JsonResponse({
            'result': 'false',
            'text': '。。。',
            })

def user_logout(request):
    logout(request)
    return JsonResponse({
            'result': 'success',
        })

def user_register(request):
    if request.method == 'POST':
        data = request.POST
        username = data.get('username').strip()
        password = data.get('password').strip()
        password_confirm = data.get('password_confirm').strip()
        if username == '':
            return JsonResponse({
                'result': 'false',
                'text' : '用户名不能为空',
                })
        if password == '':
            return JsonResponse({
                'result': 'false',
                'text': '密码不能为空',
                })
        if password_confirm == '':
            return JsonResponse({
                'result': 'false',
                'text': '请再次输入密码',
                })
        if password_confirm != password:
            return JsonResponse({
                'result': 'false',
                'text': '密码不一致',
                })
        if User.objects.filter(username=username).exists():
            return JsonResponse({
                'result': 'false',
                'text': '用户名已存在',
                })
        user = User.objects.create_user(username=username, password=password)
        user.save()
        player = Player.objects.create(user=user, photo='https://bkimg.cdn.bcebos.com/pic/2f738bd4b31c8701a18b454f1f2a892f070828385146', back_img='https://app3774.acapp.acwing.com.cn/static/superperson/images/menu/hakase.jpg')
        login(request,user)
        return JsonResponse({
            'result': 'success',
            'text': '',
            })


