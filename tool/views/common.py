import os
import json
from acapp.settings import BASE_DIR
import numpy as np
import datetime
import traceback

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

def get_latest_date(file_header, last_crawl_date):
    filepath = os.path.join(BASE_DIR, 'media', 'tool', file_header)
    last_date = last_crawl_date
    if os.path.lexists(filepath):
        for filep in os.listdir(filepath):
            fname = filep[:-5]
            ymd = fname.split('-')
            rd = datetime.datetime.replace(datetime.datetime.now(), int(ymd[0]), int(ymd[1]), int(ymd[2]))
            if (rd - last_date).days > 0:
                last_date = rd
    return last_date

def get_analysis_json_from_date(last_crawl_date, file_header):
    filename = '-'.join([str(last_crawl_date.year),str(last_crawl_date.month), str(last_crawl_date.day), 'analysis']) + '.json'
    filepath = os.path.join(BASE_DIR, 'media', 'tool', file_header, filename)
    if not os.path.exists(filepath):
        return False, filename
    else:
        return True, None

def clean_json(file_header):
    filedir = os.path.join(BASE_DIR, 'media', 'tool', file_header)
    if not os.path.lexists(filedir):
        return False
    file_list = os.listdir(filedir)
    for file in file_list:
        try:
            os.remove(os.path.join(BASE_DIR, 'media', 'tool', file_header, file))
        except Exception as e:
            traceback.print_exc()
            return False
    return True

