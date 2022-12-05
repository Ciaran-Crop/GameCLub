from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render

class MenuPage(APIView):
    def get(self, request):
        data = request.GET
        if data.get('platform', 'web') == 'web':
            return render(request, 'splendor/web/menu/index.html')
