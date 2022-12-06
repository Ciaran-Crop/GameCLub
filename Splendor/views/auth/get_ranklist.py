from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from Splendor.models.player import SplendorPlayer as Player
from gameclub.models.user_profile import UserProfile

class RankListInfo(APIView):
    permission_classes = [(IsAuthenticated)]

    def post(self, request):
        data = request.POST
        range_min = int(data['range_min'])
        range_max = int(data['range_max'])
        last_rank_list = []
        ranklist = Player.objects.order_by('-score')
        for player in ranklist:
            user_profile = UserProfile.objects.get(user = player.user)
            last_rank_list.append({
                'email': player.user.username,
                'photo': user_profile.photo_url(),
                'name': user_profile.name,
                'score': player.score,
            })

        return Response({
            'result': 'success',
            'content': last_rank_list[range_min - 1: range_max],
        })


