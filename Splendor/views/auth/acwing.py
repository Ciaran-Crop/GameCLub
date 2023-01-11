from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.core.cache import cache
from urllib.parse import quote
from rest_framework_simplejwt.tokens import RefreshToken
from gameclub.views.common import get_state, BASE_URL
import requests
import random
from gameclub.models.user_profile import UserProfile

class ApplyCode(APIView):
    def get(self, request):
        state = get_state()
        cache.set('applycode-' + state, True, 3600)
        app_id = 4441
        redirect_uri = BASE_URL + 'splendor/auth/receive_code/'
        scope = 'userinfo'
        return Response({
            'result' : 'success',
            'appid': app_id,
            'redirect_uri': quote(redirect_uri),
            'scope': scope,
            'state': state,
        })


class ReceiveCode(APIView):
    def errorMsg(self, text):
        return Response({
            'result': text,
        })

    def successMsg(self, user):
        refresh = RefreshToken.for_user(user)
        return Response({
            'result': 'success',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
        })

    def get(self, request):
        data = request.GET
        code = data['code']
        state = data['state']
        if not cache.has_key('applycode-' + state):
            return self.errorMsg("state not existed")
        cache.delete('applycode-' + state)

        app_id = 4441
        secret = "c73fca6e2b21482181fe3abbf744520e"

        params = {
            'appid': app_id,
            'secret': secret,
            'code': code,
        }
        apply_url = 'https://www.acwing.com/third_party/api/oauth2/access_token/'
        access_token_json = requests.get(apply_url,params = params).json()

        if access_token_json.get('errcode', '') != '':
            return self.errorMsg(access_token_json.get('errcode'))

        access_token = access_token_json['access_token']
        openid = access_token_json['openid']

        user_profiles = UserProfile.objects.filter(openid = openid)
        if user_profiles.exists():
            user_profile = user_profiles[0]
            user = user_profile.user
            return self.successMsg(user)

        info_url = 'https://www.acwing.com/third_party/api/meta/identity/getinfo/'
        info_params = {
            'access_token': access_token,
            'openid': openid,
        }

        info = requests.get(info_url, params = info_params).json()

        if info.get('errcode', '') != '':
            return self.errorMsg(info.get('errcode'))

        username = info['username']
        photo = info['photo']

        user_profiles = UserProfile.objects.filter(name = username)
        if user_profiles.exists():
            user_profile = user_profiles[0]
            user = user_profile.user
            return self.successMsg(user)

        while User.objects.filter(username='{}@gameclub.net'.format(username)).exists():
            username += str(random.randint(0,9))

        user = User.objects.create(username = '{}@gameclub.net'.format(username))
        user.save()
        user_profile = UserProfile.objects.create(user = user, name = username, openid = openid)
        user_profile.get_remote_image(photo)
        user_profile.save()
        return self.successMsg(user)