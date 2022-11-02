from django.db import models
from django.contrib.auth.models import User

DEFAULT_BACK_IMG = 'https://app3774.acapp.acwing.com.cn/static/superperson/images/menu/hakase.jpg'

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photo = models.CharField(max_length = 256, blank=True)
    back_img = models.CharField(default=DEFAULT_BACK_IMG,max_length = 256, blank=True)
    open_id = models.CharField(default='', max_length = 50, blank = True)
    def __str__(self):
        return str(self.user)
