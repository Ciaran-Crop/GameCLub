from django.http import JsonResponse
import requests
from django.core.cache import cache
from django.contrib.auth.models import User
from game.models.player import Player
from django.contrib.auth import login
from django.shortcuts import redirect
from urllib.parse import quote
from random import randint

BASE_URL = "https://app3774.acapp.acwing.com.cn"
BASE_NAME = "superperson-index"
CODE_URL = "https://www.acwing.com/third_party/api/oauth2/web/authorize/"
ACCESS_URL = "https://www.acwing.com/third_party/api/oauth2/access_token/"
INFO_URL = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
APP_ID = "3774"
APP_SECRET = "aed26a7c5b2c4c16983830b8a47fa186"
REDIRECT_URI = quote(BASE_URL + "/superperson/settings/web/acwing/receive_code/")
SCOPE = "userinfo"

def apply_code(request):
    def get_state():
        state = ""
        for i in range(8):
            state += str(randint(1,9))
        return state

    STATE = get_state()
    apply_code_url = "{}?appid={}&redirect_uri={}&scope={}&state={}".format(CODE_URL,APP_ID, REDIRECT_URI, SCOPE, STATE)
    cache.set(STATE, True, 7200)
    return JsonResponse({
        'result': 'success',
        'url': apply_code_url,
        })

def receive_code(request):
    data = request.GET
    state = data['state']
    code = data['code']

    if not cache.has_key(state):
        return redirect(BASE_NAME)

    cache.delete(state)

    params = {
        'appid': APP_ID,
        'secret': APP_SECRET,
        'code': code,
    }

    access_tokens = requests.get(ACCESS_URL, params = params).json()

    if access_tokens.get('errcode', "") == "40001":
        return redirect(BASE_NAME)

    openid = access_tokens['openid']
    access_token = access_tokens['access_token']

    player = Player.objects.filter(open_id = openid)
    if player.exists():
        user = player[0].user
        login(request, user)
        return redirect(BASE_NAME)

    info_params = {
        'access_token': access_token,
        'openid': openid,
    }

    infos = requests.get(INFO_URL, params = info_params).json()

    if infos.get('errcode', "") == "40004":
        return redirect(BASE_NAME)

    username = infos['username']
    photo = infos['photo']

    while User.objects.filter(username=username).exists():
        username += str(randint(0,9))

    user = User.objects.create(username=username)
    Player.objects.create(user = user, photo = photo, open_id = openid)
    login(request,user)

    return redirect(BASE_NAME)
