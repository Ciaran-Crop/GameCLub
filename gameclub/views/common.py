import random
from acapp.settings import BASE_DIR
import os
import sys

BASE_URL = "https://app3774.acapp.acwing.com.cn/"
debug = True
debug = False

def Dprint(*args, **kargs):
    if debug:
        sep = kargs.get('sep', ' ')
        end = kargs.get('end', '\n')
        file = kargs.get('file', sys.stdout)
        output = ''
        first = True
        for arg in args:
            output += ("" if first else sep) + str(arg)
            first = False
        file.write(output + end)

def get_state():
    state = ""
    choice_list = "abcdefghijklmnobqrstuvwxyzABCDEFGHIGKLMNOBQRSTUVWXYZ1234567890"
    for i in range(8):
        state += random.choice(choice_list)
    return state

def new_filename(basename = ''):
    state = get_state()
    state1 = get_state()
    return state + '_gameclub_' + state1 + basename + '.jpg'

def remove_file(filename):
    Dprint('remove_file_name: ', filename)
    filepath = os.path.join(BASE_DIR, filename[1:])
    Dprint('remove_file_path: ', filepath)
    if os.path.exists(filepath):
        Dprint('exists')
        try:
            Dprint('remove')
            os.remove(filepath)
        except:
            Dprint('remove fail')
            return False
    Dprint('remove success')
    return True
