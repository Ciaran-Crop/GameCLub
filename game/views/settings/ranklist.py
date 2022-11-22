from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from game.models.player import Player
from gameclub.models.user_profile import UserProfile


class RankList(APIView):
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        players = Player.objects.all().order_by('-score')[:10]
        resp = []

        for pr in players:
            user_profile = UserProfile.objects.get(user = pr.user)
            resp.append({
                'username': user_profile.name,
                'score': user_profile.photo_url(),
                'photo': user_profile.back_url(),
            })
        return Response(resp)

