from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from game.models.player import Player


class RankList(APIView):
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        players = Player.objects.all().order_by('-score')[:10]
        resp = []

        for pr in players:
            resp.append({
                'username': pr.user.username,
                'score': pr.score,
                'photo': pr.photo,
            })
        return Response(resp)

