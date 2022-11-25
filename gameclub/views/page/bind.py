from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render

class BindView(APIView):
    def get(self, request):
        data = request.GET
        context = {
            'email': data.get('email', ''),
        }
        return render(request, 'gameclub/web/bind/index.html', context)
