from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from gameclub.views.common import get_state
from django.contrib.auth.models import User

class SendEmail(APIView):
    def post(self, request):
        data = request.POST
        email = data['email']
        change = data['change']
        if change == 'false':
            if User.objects.filter(username = email):
                return Response({
                    'result': '邮箱已被占用',
                })
        else:
            if not User.objects.filter(username = email):
                return Response({
                    'result': '邮箱账户不存在'
                })
        random_state = get_state();
        cache.set(email + '-' + random_state, True, 60 * 5)
        try:
            send_mail('GameClub 验证码',
                '感谢使用GaneClub平台，您的验证码为\n' + random_state + '\n验证码有效期为 5分钟 \n本邮件为自动发送，请勿回复!',
                'gameclub_robot@yeah.net',
                [email],
                fail_silently = True)
            return Response({
                'result': 'success',
            })
        except :
            return Response({
                'result': '发送失败',
            })
