from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from game.models.player import Player
from gameclub.models.user_profile import UserProfile
from gameclub.models.user_game import UserGameInfo
from gameclub.models.game import GameInfo

class InfoView(APIView):
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        user = request.user
        players = Player.objects.filter(user = user)
        if not players.exists():
            Player.objects.create(user = user)
        user_profiles = UserProfile.objects.get(user = user)
        game = GameInfo.objects.get(name = 'SuperPerson')
        user_game_record = UserGameInfo.objects.filter(user_profile = user_profiles, game = game)
        if not user_game_record.exists():
            UserGameInfo.objects.create(user_profile = user_profiles, game = game)

        user_game_record = UserGameInfo.objects.get(user_profile = user_profiles, game = game)
        user_game_record.save()
        return Response({
            'result': 'success',
            'email': user.username,
            'name' : user_profiles.name,
            'photo': user_profiles.photo_url(),
            'back_img': user_profiles.back_url(),
        })

