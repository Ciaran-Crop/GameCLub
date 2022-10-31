from django.http import JsonResponse
from game.models.player import Player

def get_info_web(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': '未登录',
            })
    player = Player.objects.all()[0]
    return JsonResponse({
        'result': 'success',
        'username': user.username,
        'email': player.email,
        'photo':player.photo,
        'platform':'WEB',
    })

def get_info_ac(request):
    player = Player.objects.all()[0]
    return JsonResponse({
        'result':'success',
        'username': player.user.username,
        'email': player.email,
        'photo':' ',
        'platform':'ACAPP',
        })


def get_info(request):
    platform = request.GET.get("platform");
    if platform == "WEB":
        return get_info_web(request)
    elif platform == "ACAPP" :
        return get_info_ac(request)
