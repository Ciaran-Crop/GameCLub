from django.db import models
from django.contrib.auth.models import User
import os
from django.core.files import File
from urllib.request import urlopen
from tempfile import NamedTemporaryFile

def user_directory_path(instance, filename):
    return os.path.join('user', str(instance.user.id), filename)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length = 128, blank = True)
    openid = models.CharField(max_length = 128, blank = True)
    photo =  models.ImageField(upload_to = user_directory_path, blank = True)
    back = models.ImageField(upload_to = user_directory_path, blank = True)

    def __str__(self):
        return str(self.user)

    def photo_url(self):
        if self.photo and hasattr(self.photo, 'url'):
            return self.photo.url
        else:
            return '/media/default/user.jpg'

    def back_url(self):
        if self.back and hasattr(self.back, 'url'):
            return self.back.url
        else:
            return '/media/default/back.jpg'

    def get_remote_image(self, url):
        if url and not self.photo:
            img_temp = NamedTemporaryFile(delete=True)
            img_temp.write(urlopen(url).read())
            img_temp.flush()
            self.photo.save(
                    os.path.basename(url),
                    File(img_temp)
                    )
            self.save()




