from django.db import models
from gameclub.models.user_profile import UserProfile
from gameclub.models.game import GameInfo
import datetime

class UserGameInfo(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    game = models.ForeignKey(GameInfo, on_delete=models.CASCADE)

    last_play = models.DateField(blank = True, auto_now = True)

    def __str__(self):
        return str(self.user_profile) + str(self.game)

    def get_last_play(self):
        return self.last_play



