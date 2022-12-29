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

def random_cards():
    level1 = 40
    level2 = 30
    level3 = 20
    base_level1_list = []
    for i in range(0, level1):
        base_level1_list.append(i)
    base_level1_list = sorted(base_level1_list, key=lambda x: random.random())
    base_level2_list = []
    for i in range(0, level2):
        base_level2_list.append(i)
    base_level2_list = sorted(base_level2_list, key=lambda x: random.random())
    base_level3_list = []
    for i in range(0, level3):
        base_level3_list.append(i)
    base_level3_list = sorted(base_level3_list, key=lambda x: random.random())
    return [base_level1_list, base_level2_list, base_level3_list]

def random_nobles():
    length = 10
    base_nobles = []
    for i in range(0, length):
        base_nobles.append(i)
    base_nobles = sorted(base_nobles, key=lambda x: random.random())
    return base_nobles