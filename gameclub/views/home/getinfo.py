from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class InfoView(APIView):
    permission_classes = [(IsAuthenticated)]

    def post(self, request):
        return Response({
            'result' : 'success',
        })
