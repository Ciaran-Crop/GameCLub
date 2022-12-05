from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render

class LoginPage(APIView):
    def get(self, request):
        data = request.GET
        content = {
            'access': data.get('access', ''),
            'refresh': data.get('refresh', ''),
        }
        if data.get('platform', 'web') == 'web':
            return render(request, 'splendor/web/login/index.html', content)
