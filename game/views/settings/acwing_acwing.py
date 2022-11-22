from django.http import JsonResponse
import requests
from django.core.cache import cache
from django.contrib.auth.models import User
from game.models.player import Player
from django.contrib.auth import login
from urllib.parse import quote
from random import randint
from rest_framework_simplejwt.tokens import RefreshToken
from gameclub.models.user_profile import UserProfile

BASE_URL = "https://app3774.acapp.acwing.com.cn"
BASE_NAME = "superperson-index"
CODE_URL = "https://www.acwing.com/third_party/api/oauth2/web/authorize/"
ACCESS_URL = "https://www.acwing.com/third_party/api/oauth2/access_token/"
INFO_URL = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
APP_ID = "3774"
APP_SECRET = "aed26a7c5b2c4c16983830b8a47fa186"
REDIRECT_URI = quote(BASE_URL + "/superperson/settings/acwing/acwing/receive_code/")
SCOPE = "userinfo"

def apply_code(request):
    def get_state():
        state = ""
        for i in range(8):
            state += str(randint(1,9))
        return state

    STATE = get_state()
    cache.set(STATE, True, 7200)
    return JsonResponse({
        'result': 'success',
        'appid': APP_ID,
        'redirect_uri': REDIRECT_URI,
        'scope': SCOPE,
        'state': STATE,
        })

def receive_code(request):
    data = request.GET


    if data.get("errcode","") == "40010":
        return JsonResponse({
            'result': data['errmsg'],
            })
    state = data['state']
    code = data['code']

    if not cache.has_key(state):
        return JsonResponse({
            'result': 'state error',
            })

    cache.delete(state)

    params = {
        'appid': APP_ID,
        'secret': APP_SECRET,
        'code': code,
    }

    access_tokens = requests.get(ACCESS_URL, params = params).json()

    if access_tokens.get('errcode', "") == "40001":
        return JsonResponse({
            'result': access_tokens['errmsg'],
            })

    openid = access_tokens['openid']
    access_token = access_tokens['access_token']

    user_profiles = UserProfile.objects.filter(openid = openid)
    if user_profiles.exists():
        user_profile = user_profiles[0]
        user = user_profile.user
        player = Player.objects.filter(user = user)
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            'result': 'success',
            'username': user_profile.name,
            'photo': user_profile.photo_url(),
            'back_img': user_profile.back_url(),
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            })

    info_params = {
        'access_token': access_token,
        'openid': openid,
    }

    infos = requests.get(INFO_URL, params = info_params).json()

    if infos.get('errcode', "") == "40004":
        return JsonResponse({
            'result': infos['errmsg'],
            })


    username = infos['username']
    photo = infos['photo']

    while User.objects.filter(username='{}@gameclub.net'.format(username)).exists():
        username += str(randint(0,9))

    user = User.objects.create(username = '{}@gameclub.net'.format(username))
    player = Player.objects.create(user = user)
    user_profile = UserProfile.objects.create(user = user, name = username, openid = openid)
    user_profile.get_remote_image(photo)
    refresh = RefreshToken.for_user(user)
    return JsonResponse({
        'result': 'success',
        'username': user_profile.name,
        'photo': user_profile.photo_url(),
        'back_img': user_profile.back_url(),
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    })

