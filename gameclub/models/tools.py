from django.db import models
import os
from django.core.files import File
from tempfile import NamedTemporaryFile
from gameclub.views.common import new_filename

def tool_directory_path(instance, filename):
    return os.path.join('tool', str(instance.name), filename)

class Tool(models.Model):
    name = models.CharField(max_length = 128, blank = True)
    types = models.CharField(max_length = 128, blank = True)
    photo = models.ImageField(upload_to = tool_directory_path, blank = True)
    url = models.URLField(max_length = 128, blank=True)

    def __str__(self):
        return str(self.name)

    def get_photo(self):
        if self.photo and hasattr(self.photo, 'url'):
            return self.photo.url
        else:
            return '/media/default/tool.jpg'

    def get_name(self):
        return self.name

    def get_types(self):
        return self.types

    def get_url(self):
        return self.url

    def set_photo(self, f):
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

    def set_url(self, url):
        self.url = url
        self.save()

    def set_name(self, name):
        self.name = name
        self.save()

    def set_type(self, types):
        self.types = types;
        self.save()


