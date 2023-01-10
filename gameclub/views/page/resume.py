from rest_framework.views import APIView
from django.shortcuts import render

class ResumeAPI(APIView):
    def get(self, request):
        return render(request, 'gameclub/web/resume/index.html')
