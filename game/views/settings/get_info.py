from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from game.models.player import Player
from gameclub.models.user_profile import UserProfile

class InfoView(APIView):
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        user = request.user
        player = Player.objects.get(user = user)
        user_profiles = UserProfile.objects.get(user = user)
        return Response({
            'result': 'success',
            'username' : user_profiles.name,
            'photo': user_profiles.photo_url(),
            'back_img': user_profiles.back_url(),
        })

