from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render

class IndexView(APIView):
    def get(self, request):
        data = request.GET
        content = {
            'access': data.get('access', ""),
            'refresh': data.get('refresh', "")
        }
        return render(request, 'gameclub/web/index.html', content)
