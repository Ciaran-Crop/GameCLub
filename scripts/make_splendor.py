import random
import json
gem_list = ['I', 'R', 'G', 'B', 'W'] # 往后为顺时针
# 顺时针下一个颜色称为顺临色
# 顺时针下两个颜色称为顺对色
# 逆时针下一个颜色称为逆临色
# 逆时针下两个颜色称为逆对色

def randomi(a, b):
    return random.randint(a, b)

def mod(a):
    return (a + 5) % 5

def next_one(index):
    return mod(index + 1)

def next_two(index):
    return mod(index + 2)

def before_one(index):
    return mod(index - 1)

def before_two(index):
    return mod(index - 2)

# noble format
# { id: 41, 
# score: 3, 
# backIndex: [0, 1], 0 ~ 1, 0 ~ 4
# spend: [{color: W, need: 4}, {color: B, need: 4}] }

def get_nobles():
    n_id = 0
    score = 3
    index_1 = 0
    index_2 = 0
    nobles = []

    # 44临色
    for index in range(0, 5):
        n_id += 1
        noble = {'id': int('4' + str(n_id)), 'score': score, 'backIndex':[index_1, index_2], 
        'spend': [{'color': gem_list[index], 'need': 4}, {'color': gem_list[next_one(index)], 'need': 4}]}
        nobles.append(noble)
        index_2+= 1
    index_1 += 1
    index_2 = 0
    # 333临色
    for index in range(0, 5):
        n_id += 1
        noble = {'id': int('4' + str(n_id)), 'score': score, 'backIndex':[index_1, index_2], 
        'spend': [{'color': gem_list[index], 'need': 3}, {'color': gem_list[next_one(index)], 'need': 3}, {'color': gem_list[next_two(index)], 'need': 3}]}
        nobles.append(noble)
        index_2+= 1

    nobles = json.dumps(nobles)
    return nobles

def get_level_3():
    # card format
    # { id: 31, 
    # score: 5, 
    # backIndex: [0, 1], 0 ~ 4, 0 ~ 4
    # spend: [{color: W, need: 4}, {color: B, need: 4}] }
    c_id = 0
    c_id_prefix = '3'
    level3_cards = []

    # 37 顺临
    for index in range(0, 5):
        c_id += 1
        card = {'id': int(c_id_prefix + str(c_id)), 'score': 5, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[index], 'need': 3}, {'color': gem_list[next_one(index)], 'need': 7}]}
        level3_cards.append(card)
    
    # 7 顺临
    for index in range(0, 5):
        c_id += 1
        card = {'id': int(c_id_prefix + str(c_id)), 'score': 4, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[index], 'need': 7}]}
        level3_cards.append(card)
    
    # 633 6顺临 3本色 3顺对 
    for index in range(0, 5):
        c_id += 1
        card = {'id': int(c_id_prefix + str(c_id)), 'score': 4, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[index], 'need': 3}, {'color': gem_list[next_one(index)], 'need': 6}, {'color': gem_list[next_two(index)], 'need': 3}]}
        level3_cards.append(card)

    # 5333 5顺对 3顺临 3逆对 3逆临
    for index in range(0, 5):
        c_id += 1
        card = {'id': int(c_id_prefix + str(c_id)), 'score': 3, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[next_two(index)], 'need': 5}, 
        {'color': gem_list[next_one(index)], 'need': 3}, 
        {'color': gem_list[before_one(index)], 'need': 3},
        {'color': gem_list[before_two(index)], 'need': 3}]}
        level3_cards.append(card)

    level3_cards = json.dumps(level3_cards)
    return level3_cards

def get_level_2():
    # card format
    # { id: 31, 
    # score: 5, 
    # backIndex: [0, 1], 0 ~ 4, 0 ~ 4
    # spend: [{color: W, need: 4}, {color: B, need: 4}] }
    c_id = 0
    c_id_prefix = '2'
    level2_cards = []

    # 6本色
    for index in range(0, 5):
        c_id += 1
        card = {'id': int(c_id_prefix + str(c_id)), 'score': 3, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[index], 'need': 6}]}
        level2_cards.append(card)

    # 53 
    # gem_list = ['I', 'R', 'G', 'B', 'W']
    # 绿：3本色 5顺临（2）
    c_id += 1
    index = 2
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 2, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[index], 'need': 3}, {'color': gem_list[next_one(index)], 'need': 5}]}
    level2_cards.append(card)
    # 蓝：3本色 5顺临（2）
    c_id += 1
    index = 3
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 2, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[index], 'need': 3}, {'color': gem_list[next_one(index)], 'need': 5}]}
    level2_cards.append(card)
    # 白：3顺临 5顺对（2）
    c_id += 1
    index = 4
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 2, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[next_one(index)], 'need': 3}, {'color': gem_list[next_two(index)], 'need': 5}]}
    level2_cards.append(card)
    # 黑：3顺临 5顺对（2）
    c_id += 1
    index = 0
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 2, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[next_one(index)], 'need': 3}, {'color': gem_list[next_two(index)], 'need': 5}]}
    level2_cards.append(card)
    # 红：3逆对 5逆临（2）
    c_id += 1
    index = 1
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 2, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[before_two(index)], 'need': 3}, {'color': gem_list[before_one(index)], 'need': 5}]}
    level2_cards.append(card)

    # 5
    # gem_list = ['I', 'R', 'G', 'B', 'W']
    # 绿：5本色（2）
    c_id += 1
    index = 2
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 2, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[index], 'need': 5}]}
    level2_cards.append(card)
    # 蓝：5本色（2）
    c_id += 1
    index = 3
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 2, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[index], 'need': 5}]}
    level2_cards.append(card)
    # 白：5顺对（2）
    c_id += 1
    index = 4
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 2, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[next_two(index)], 'need': 5}]}
    level2_cards.append(card)
    # 黑：5逆临（2）
    c_id += 1
    index = 0
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 2, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[before_one(index)], 'need': 5}]}
    level2_cards.append(card)
    # 红：5逆临（2）
    c_id += 1
    index = 1
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 2, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[before_one(index)], 'need': 5}]}
    level2_cards.append(card)

    # 421 4顺对 2顺临 1逆对（2）
    for index in range(0, 5):
        c_id += 1
        card = {'id': int(c_id_prefix + str(c_id)), 'score': 2, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[next_two(index)], 'need': 4},
        {'color': gem_list[next_one(index)], 'need': 2},
        {'color': gem_list[before_two(index)], 'need': 1}]}
        level2_cards.append(card)

    # 332 3顺对 3逆临 2本色（1）
    for index in range(0, 5):
        c_id += 1
        card = {'id': int(c_id_prefix + str(c_id)), 'score': 1, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[next_two(index)], 'need': 3},
        {'color': gem_list[before_one(index)], 'need': 3},
        {'color': gem_list[index], 'need': 2}]}
        level2_cards.append(card)
    
    # 322
    # 绿：3顺临 2顺对 2逆对（1）
    c_id += 1
    index = 2
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 1, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[next_one(index)], 'need': 3},
    {'color': gem_list[next_two(index)], 'need': 2},
    {'color': gem_list[before_two(index)], 'need': 2}]}
    level2_cards.append(card)
    # 蓝：3逆对 2逆临 2本色（1）
    c_id += 1
    index = 3
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 1, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[before_two(index)], 'need': 3},
    {'color': gem_list[before_one(index)], 'need': 2},
    {'color': gem_list[index], 'need': 2}]}
    level2_cards.append(card)
    # 白：3逆对 2顺临 2顺对（1）
    c_id += 1
    index = 4
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 1, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[before_two(index)], 'need': 3},
    {'color': gem_list[next_one(index)], 'need': 2},
    {'color': gem_list[next_two(index)], 'need': 2}]}
    level2_cards.append(card)
    # 黑：3逆临 2顺对 2逆对（1）
    c_id += 1
    index = 0
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 1, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[before_one(index)], 'need': 3},
    {'color': gem_list[next_two(index)], 'need': 2},
    {'color': gem_list[before_two(index)], 'need': 2}]}
    level2_cards.append(card)
    # 红：3逆临 2逆对 2本色（1）
    c_id += 1
    index = 1
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 1, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[before_one(index)], 'need': 3},
    {'color': gem_list[before_two(index)], 'need': 2},
    {'color': gem_list[index], 'need': 2}]}
    level2_cards.append(card)

    level2_cards = json.dumps(level2_cards)
    return level2_cards

def get_level_1():
    c_id = 0
    c_id_prefix = '1'
    level1_cards = []

    # 4逆对（1）
    for index in range(0, 5):
        c_id += 1
        card = {'id': int(c_id_prefix + str(c_id)), 'score': 1, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[before_two(index)], 'need': 4}]}
        level1_cards.append(card)
    
    # 311：
    # 绿：3顺临 1本色 1顺对
    c_id += 1
    index = 2
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[next_one(index)], 'need': 3},
    {'color': gem_list[index], 'need': 1},
    {'color': gem_list[next_two(index)], 'need': 1}]}
    level1_cards.append(card)
    # 蓝：3逆临 1本色 1逆对
    c_id += 1
    index = 3
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[before_one(index)], 'need': 3},
    {'color': gem_list[index], 'need': 1},
    {'color': gem_list[before_two(index)], 'need': 1}]}
    level1_cards.append(card)
    # 白：3本色 1顺临 1逆临
    c_id += 1
    index = 4
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[index], 'need': 3},
    {'color': gem_list[next_one(index)], 'need': 1},
    {'color': gem_list[before_one(index)], 'need': 1}]}
    level1_cards.append(card)
    # 黑：3顺临 1本色 1顺对
    c_id += 1
    index = 0
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[next_one(index)], 'need': 3},
    {'color': gem_list[index], 'need': 1},
    {'color': gem_list[next_two(index)], 'need': 1}]}
    level1_cards.append(card)
    # 红：3逆临 1本色 1逆对
    c_id += 1
    index = 1
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[before_one(index)], 'need': 3},
    {'color': gem_list[index], 'need': 1},
    {'color': gem_list[before_two(index)], 'need': 1}]}
    level1_cards.append(card)

    # 221：
    # 2逆对 2逆临 1顺临

    for index in range(0, 5):
        c_id += 1
        card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[before_two(index)], 'need': 2},
        {'color': gem_list[before_one(index)], 'need': 2},
        {'color': gem_list[next_one(index)], 'need': 1}]}
        level1_cards.append(card)

    # 2111：
    # 2逆对 1逆临 1顺临 1顺对
    for index in range(0, 5):
        c_id += 1
        card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[before_two(index)], 'need': 2},
        {'color': gem_list[before_one(index)], 'need': 1},
        {'color': gem_list[next_one(index)], 'need': 1},
        {'color': gem_list[next_two(index)], 'need': 1}]}
        level1_cards.append(card)
    
    # 22：
    # 绿：2顺临 2逆临
    c_id += 1
    index = 2
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[next_one(index)], 'need': 2},
    {'color': gem_list[before_one(index)], 'need': 2},]}
    level1_cards.append(card)
    # 蓝：2顺对 2逆临
    c_id += 1
    index = 3
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[next_two(index)], 'need': 2},
    {'color': gem_list[before_one(index)], 'need': 2},]}
    level1_cards.append(card)
    # 白：2顺临 2逆临
    c_id += 1
    index = 4
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[next_one(index)], 'need': 2},
    {'color': gem_list[before_one(index)], 'need': 2},]}
    level1_cards.append(card)
    # 黑：2顺对 2逆临
    c_id += 1
    index = 0
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[next_two(index)], 'need': 2},
    {'color': gem_list[before_one(index)], 'need': 2},]}
    level1_cards.append(card)
    # 红：2本色 2逆对
    c_id += 1
    index = 1
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[index], 'need': 2},
    {'color': gem_list[before_two(index)], 'need': 2},]}
    level1_cards.append(card)

    # 1111
    # 1顺临 1顺对 1逆对 1逆临
    for index in range(0, 5):
        c_id += 1
        card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[next_one(index)], 'need': 1},
        {'color': gem_list[next_two(index)], 'need': 1},
        {'color': gem_list[before_one(index)], 'need': 1},
        {'color': gem_list[before_two(index)], 'need': 1},]}
        level1_cards.append(card)

    #单3：
    # 绿：3逆临
    c_id += 1
    index = 2
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[before_one(index)], 'need':3}]}
    level1_cards.append(card)
    # 蓝：3顺对
    c_id += 1
    index = 3
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[next_two(index)], 'need': 3}]}
    level1_cards.append(card)
    # 白：3逆临
    c_id += 1
    index = 4
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[before_one(index)], 'need': 3}]}
    level1_cards.append(card)
    # 黑：3顺对
    c_id += 1
    index = 0
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[next_two(index)], 'need': 3}]}
    level1_cards.append(card)
    # 红：3逆对
    c_id += 1
    index = 1
    card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
    'backIndex': [randomi(0, 4), randomi(0, 4)],
    'spend': [{'color': gem_list[before_two(index)], 'need': 3}]}
    level1_cards.append(card)

    # 21：
    # 2顺对 1顺临
    for index in range(0, 5):
        c_id += 1
        card = {'id': int(c_id_prefix + str(c_id)), 'score': 0, 'gem': gem_list[index],
        'backIndex': [randomi(0, 4), randomi(0, 4)],
        'spend': [{'color': gem_list[next_two(index)], 'need': 2},
        {'color': gem_list[next_one(index)], 'need': 1}]}
        level1_cards.append(card)

    level1_cards = json.dumps(level1_cards)
    return level1_cards

if __name__ == "__main__":
    print(get_level_3())
    # print(someting)
    print('begin')