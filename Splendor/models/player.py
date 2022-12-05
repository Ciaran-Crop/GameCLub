from django.db import models
from django.contrib.auth.models import User

class SplendorPlayer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    score = models.IntegerField(default=1500)

    def __str__(self):
        return str(self.user)
