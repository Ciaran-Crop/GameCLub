from django.http import JsonResponse
from game.models.player import Player

def get_info_web(request):
    player = Player.objects.all()[0]
    return JsonResponse({
        'result': 'success',
        'play_name': player.name,
        'email': player.email,
        'photo':player.photo,
    })

def get_info_ac(request):
    player = Player.objects.all()[0]
    return JsonResponse({
        'result':'success',
        'play_name': player.name,
        'email': player.email,
        'photo':player.photo,
        })


def get_info(request):
    platform = request.GET.get("platform");
    if platform == "WEB":
        return get_info_web(request)
    elif platform == "AC" :
        return get_info_ac(request)
