from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from gameclub.models.user_profile import UserProfile
from gameclub.models.user_game import UserGameInfo
from gameclub.models.game import GameInfo

class InfoView(APIView):
    permission_classes = [(IsAuthenticated)]

    def post(self, request):
        user = request.user
        user_profile = UserProfile.objects.get(user = user)

        return Response({
            'result' : 'success',
            'user_id': user_profile.id,
            'photo': user_profile.photo_url(),
            'back': user_profile.back_url(),
            'email': user_profile.user.username,
            'name': user_profile.name,
            'game_list': self.get_game_list(),
            'game_play': self.get_game_play(request.user),
        })


    def get_game_list(self):
        games = GameInfo.objects.all()
        game_list = []

        for game in games:
            game_list.append({
                'name': game.get_name(),
                'types': game.get_types(),
                'photo': game.get_photo(),
                'url': game.get_url(),
            })

        return game_list

    def get_game_play(self, user):
        games = UserGameInfo.objects.filter(user_profile__user = user).order_by('-last_play')
        game_list = []

        for game in games:
            game_list.append({
                'name': game.game.get_name(),
                'types': game.game.get_types(),
                'photo': game.game.get_photo(),
                'url': game.game.get_url(),
                'last_date': game.get_last_play(),
            })

        return game_list

