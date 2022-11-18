import random

BASE_URL = "https://app3774.acapp.acwing.com.cn/"

def get_state():
    state = ""
    choice_list = "abcdefghijklmnobqrstuvwxyzABCDEFGHIGKLMNOBQRSTUVWXYZ1234567890"
    for i in range(8):
        state += random.choice(choice_list)
    return state

