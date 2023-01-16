from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.core.cache import cache
from urllib.parse import quote
from django.shortcuts import redirect, reverse
from rest_framework_simplejwt.tokens import RefreshToken
from gameclub.views.common import get_state, BASE_URL
import requests
import random
from gameclub.models.user_profile import UserProfile

class ApplyCode(APIView):
    def get(self, request):
        state = get_state()
        cache.set('applycode-' + state, True, 3600)
        app_id = 3774
        redirect_uri = BASE_URL + 'gameclub/auth/third_login/acwing/receive_code/'
        scope = 'userinfo'
        apply_url = 'https://www.acwing.com/third_party/api/oauth2/web/authorize/' + '?appid=' + str(app_id) + '&redirect_uri=' + quote(redirect_uri) + '&scope=' + scope + '&state=' + state
        return Response({
            'result' : 'success',
            'url': apply_url,
        })


class ReceiveCode(APIView):
    def get(self, request):
        BASE_NAME = 'index_html'
        data = request.GET
        code = data['code']
        state = data['state']
        if not cache.has_key('applycode-' + state):
            return redirect(BASE_NAME)
        cache.delete('applycode-' + state)

        app_id = 3774
        secret = 'aed26a7c5b2c4c16983830b8a47fa186'

        params = {
            'appid': app_id,
            'secret': secret,
            'code': code,
        }
        apply_url = 'https://www.acwing.com/third_party/api/oauth2/access_token/'
        access_token_json = requests.get(apply_url,params = params).json()

        if access_token_json.get('errcode', '') != '':
            return redirect(BASE_NAME)

        access_token = access_token_json['access_token']
        openid = access_token_json['openid']

        user_profiles = UserProfile.objects.filter(openid = openid)
        if user_profiles.exists():
            user_profile = user_profiles[0]
            user = user_profile.user
            refresh = RefreshToken.for_user(user)
            return redirect(reverse(BASE_NAME) + "?access=" + str(refresh.access_token) + '&refresh=' + str(refresh))

        info_url = 'https://www.acwing.com/third_party/api/meta/identity/getinfo/'
        info_params = {
            'access_token': access_token,
            'openid': openid,
        }

        info = requests.get(info_url, params = info_params).json()

        if info.get('errcode', '') != '':
            return redirect(BASE_NAME)

        username = info['username']
        photo = info['photo']

        user_profiles = UserProfile.objects.filter(name = username)
        if user_profiles.exists():
            user_profile = user_profiles[0]
            user = user_profile.user
            refresh = RefreshToken.for_user(user)
            return redirect(reverse(BASE_NAME) + "?access=" + str(refresh.access_token) + '&refresh=' + str(refresh))

        while User.objects.filter(username='{}@gameclub.net'.format(username)).exists():
            username += str(random.randint(0,9))

        user = User.objects.create(username = '{}@gameclub.net'.format(username))
        user.save()
        user_profile = UserProfile.objects.create(user = user, name = username, openid = openid)
        user_profile.get_remote_image(photo)
        user_profile.save()
        refresh = RefreshToken.for_user(user)

        return redirect(reverse(BASE_NAME) + "?access=" + str(refresh.access_token) + '&refresh=' + str(refresh))

