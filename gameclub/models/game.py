from django.db import models
from gameclub.models.user_profile import UserProfile

class GameInfo(models.Model):
    name = models.CharField(max_length = 128)
    photo = models.ImageField(upload_to='game/', blank = True)
    types = models.CharField(max_length = 128, blank = True)
    users = models.ManyToManyField(UserProfile, through = 'UserGameInfo')
    url = models.URLField(blank = True)

    def __str__(self):
        return str(self.name)

    def get_name(self):
        return self.name

    def get_photo(self):
        if self.photo and hasattr(self.photo, 'url'):
            return self.photo.url
        else:
            return '/media/default/game.png'

    def get_types(self):
        return self.types

    def get_url(self):
        return self.url
