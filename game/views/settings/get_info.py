from django.http import JsonResponse
from game.models.player import Player

def get_info_web(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': '未登录',
            })
    return JsonResponse({
        'result': 'success',
        'username': user.username,
        'photo': user.player.photo,
        'email': user.email,
        'back_img': user.player.back_img,
        'platform':'WEB',
    })

def get_info_ac(request):
    user = Player.objects.all()[0]
    return JsonResponse({
        'result':'success',
        'username': user.user.username,
        'photo':' ',
        'email': user.user.email,
        'back_img': user.back_img,
        'platform':'ACAPP',
        })


def get_info(request):
    platform = request.GET.get("platform");
    if platform == "WEB":
        return get_info_web(request)
    elif platform == "ACAPP" :
        return get_info_ac(request)
