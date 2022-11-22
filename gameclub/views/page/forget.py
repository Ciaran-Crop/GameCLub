from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render

class ForgetView(APIView):
    def get(self, request):
        data = request.GET
        context = {
            'email': data.get('email', ''),
        }
        return render(request, 'gameclub/web/forget/index.html', context)
