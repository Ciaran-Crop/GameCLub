import os
import json
from acapp.settings import BASE_DIR
import numpy as np

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, np.bool_):
            return bool(obj)
        return super(NpEncoder, self).default(obj)

def create_dir(filepath):
    if not os.path.lexists(os.path.dirname(filepath)):
        os.makedirs(os.path.dirname(filepath))

def write2file(fileheader:str, filename:str, content, type:str = 'csv') -> bool:
    filepath = os.path.join(BASE_DIR, 'media', 'tool', fileheader, filename)
    if not os.path.exists(filepath):
        create_dir(filepath)
    if type == 'csv':
        with open(filepath, mode='w+', encoding='utf8') as f:
            f.writelines(content)
        return True
    elif type == 'json':
        with open(filepath, mode='w+', encoding='utf8') as f:
            json.dump(content, f, cls=NpEncoder)
        return True
    return False

def read4file(filehader:str, filename:str, type: str = 'csv'):
    filepath = os.path.join(BASE_DIR, 'media', 'tool', filehader,filename)
    if not os.path.exists(filepath):
        return False, None
    if type == 'csv':
        with open(filepath, encoding='utf8', mode='r') as f:
            content = f.readlines()
        return True, content
    elif type == 'json':
        with open(filepath, encoding='utf8', mode='r') as f:
            content = json.load(f)
        return True, content
    return False, None

