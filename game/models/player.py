from django.db import models

class Player(models.Model):
    email = models.CharField(max_length = 30)
    name = models.CharField(max_length = 20)
    password = models.CharField(max_length = 256)
    photo = models.CharField(max_length = 256, blank=True)
    def __str__(self):
        return str(self.name)
