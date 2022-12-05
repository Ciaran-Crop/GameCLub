from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from Splendor.models.player import SplendorPlayer as Player
from gameclub.models.user_profile import UserProfile
from gameclub.models.user_game import UserGameInfo
from gameclub.models.game import GameInfo

class PlayerInfo(APIView):
    permission_classes = [(IsAuthenticated)]

    def post(self, request):
        # get user
        user = request.user
        # get player or create
        players = Player.objects.filter(user = user)
        if not players.exists():
            Player.objects.create(user = user)
        player = Player.objects.get(user = user)
        # get user_profile
        user_profiles = UserProfile.objects.get(user = user)
        # user-game record
        game = GameInfo.objects.get(name = 'Splendor')
        user_game_record = UserGameInfo.objects.filter(user_profile = user_profiles, game = game)
        if not user_game_record.exists():
            UserGameInfo.objects.create(user_profile = user_profiles, game = game)

        return Response({
            'result': 'success',
            'email': user.username,
            'name': user_profiles.name,
            'photo': user_profiles.photo_url(),
            'back': user_profiles.back_url(),
            'score': player.score,
        })


