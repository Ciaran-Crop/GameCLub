from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render

class SpanView(APIView):

    def get(self, request):

        return render(request, 'gameclub/web/home/index.html')
