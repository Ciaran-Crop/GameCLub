from django.db import models
from django.contrib.auth.models import User
import os
from django.core.files import File
from urllib.request import urlopen
from tempfile import NamedTemporaryFile
from gameclub.views.common import remove_file, new_filename

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

    def set_photo(self, f):
        if self.photo_url() != '/media/default/user.jpg':
            remove_file(self.photo_url())
        try:
            img_temp = NamedTemporaryFile(delete=True)
            img_temp.write(f.read())
            img_temp.flush()
            self.photo.save(
                    new_filename(),
                    File(img_temp)
                    )
            return True
        except Exception as e:
            print(e)
            return False

    def set_back(self, f):
        if self.photo_url() != '/media/default/back.jpg':
            remove_file(self.back_url())
        try:
            img_temp = NamedTemporaryFile(delete=True)
            img_temp.write(f.read())
            img_temp.flush()
            self.back.save(
                    new_filename(),
                    File(img_temp)
                    )
            return True
        except Exception as e:
            return False

    def back_url(self):
        if self.back and hasattr(self.back, 'url'):
            return self.back.url
        else:
            return '/media/default/back.jpg'

    def get_remote_image(self, url):
        if self.photo_url() != '/media/default/user.jpg':
            remove_file(self.photo_url())
        if url and not self.photo:
            img_temp = NamedTemporaryFile(delete=True)
            img_temp.write(urlopen(url).read())
            img_temp.flush()
            self.photo.save(
                    new_filename(),
                    File(img_temp)
                    )
            self.save()

    def set_email(self, email):
        self.user.username = email
        self.user.save()
        self.save()

    def set_password(self, password):
        self.user.set_password(password)
        self.user.save()
        self.save()

    def set_name(self, name):
        self.name = name
        self.save()


