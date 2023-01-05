import datetime
from acapp.settings import BASE_DIR
from tool.views.common import read4file, write2file
import requests
import re
import os
import pandas as pd
import numpy as np
import traceback

header = {
"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
"Accept-Encoding":"gzip, deflate",
"Accept-Language":"zh-CN,zh;q=0.9",
"Cache-Control":"max-age=0",
"Proxy-Connection":"keep-alive",
"Upgrade-Insecure-Requests":"1",
"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
}

file_header = 'dangdangcrawler'
last_crawl_date = datetime.datetime.fromisoformat('2001-05-01T00:00:01.000001')

def get_latest_date():
    global last_crawl_date
    filepath = os.path.join(BASE_DIR, 'media', 'tool', file_header)
    if os.path.lexists(filepath):
        for filep in os.listdir(filepath):
            fname = filep[:-5]
            ymd = fname.split('-')
            rd = datetime.datetime.replace(datetime.datetime.now(), int(ymd[0]), int(ymd[1]), int(ymd[2]))
            if (rd - last_crawl_date).days > 0:
                last_crawl_date = rd

def crawl():
    get_latest_date()
    now_date = datetime.datetime.now()
    if (now_date - last_crawl_date).days > 2:
        return crawl_new(now_date)
    else:
        return return_old(last_crawl_date)

def crawl_new(date):
    global last_crawl_date
    d = '-'.join([str(date.year),str(date.month), str(date.day)])
    filename = '-'.join([str(date.year),str(date.month), str(date.day)]) + '.json'
    url = os.path.join('media', 'tool', file_header, filename)
    content = []
    try:
        base_url = "http://bang.dangdang.com/books/fivestars/01.00.00.00.00.00-recent30-0-0-1-"
        for i in range(1, 26):
            crawl_url = base_url + str(i)
            for line in crawl_one_page(crawl_url):
                content.append(line)
    except Exception as e:
        print(e)
        return False, None, url, d
    result = write2file(file_header, filename, {'list': content}, type='json')
    last_crawl_date = date
    return result, {'list': content}, d, url

def crawl_one_page(url):
    response = requests.get(url, headers=header)
    if response.status_code != 200:
        raise Exception("status_code is not 200")
    text = response.text
    pattern_str = '<li.*?<div class="list_num.*?(\d+).*?src="(.*?)".*?class="name".*?href="(.*?)".*?title="(.*?)".*?"width:(.*?)%;".*?>(\d+)条评论.*?tuijian">(.*?)%推荐.*?publisher_info">(.*?)</div>.*?<span>(.*?)</span>.*?key=(.*?)".*?<span>(\d+)次.*?price_n">&yen;(.*?)</span>.*?price_r">&yen;(.*?)</span>.*?price_s">(.*?)折</span>.*?price_e">(.*?)</p>.*?</li>'
    pattern = re.compile(pattern_str, re.S)
    items = re.findall(pattern, text)
    for item in items:
        yield {
            'book_rank': int(item[0].strip()),
            'book_image':item[1].strip(),
            'book_page': item[2].strip(),
            'book_name': item[3].strip(),
            'book_star_level': float(item[4].strip()),
            'book_comment': int(item[5].strip()),
            'book_recommend': float(item[6].strip()),
            'book_author': process_author(item[7].strip()),
            'book_publish_time': item[8].strip(),
            'book_publish_press': item[9].strip(),
            'book_star_count': int(item[10].strip()),
            'book_discounted_price': float(item[11].strip()),
            'book_price': float(item[12].strip()),
            'book_discounted': float(item[13].strip()),
            'book_e_price': process_e_price(item[14].strip()),
        }

def process_author(author):
    z_list = []
    pattern = re.compile(r'.*?>(.*?)</a>.*?')
    for name in re.findall(pattern, author):
        z_list.append(name)
    return z_list

def process_e_price(e_price):
    pattern = re.compile(r'.*?&yen;(.*?)</span>',re.S)
    price = re.findall(pattern, e_price)
    if len(price) == 0:
        return 0
    return float(price[0])

def return_old(date) -> tuple:
    d = '-'.join([str(date.year),str(date.month), str(date.day)])
    filename = '-'.join([str(date.year),str(date.month), str(date.day)]) + '.json'
    result, content = read4file(file_header, filename, type = 'json')
    url = os.path.join('media', 'tool', file_header, filename)
    return result, content, d, url

def data_analysis(content: dict) -> dict:
    get_latest_date()
    filename = '-'.join([str(last_crawl_date.year),str(last_crawl_date.month), str(last_crawl_date.day), 'analysis']) + '.json'
    filepath = os.path.join(BASE_DIR, 'media', 'tool', file_header, filename)
    if not os.path.exists(filepath):
        return analysis_new(content, filename)
    else:
        return analysis_old(last_crawl_date)

def analysis_old(date) -> dict:
    filename = '-'.join([str(date.year),str(date.month), str(date.day), 'analysis']) + '.json'
    result, analysis_result = read4file(file_header, filename, 'json')
    if analysis_result is None:
        analysis_result = {}
    analysis_result['result'] = result
    return analysis_result

def analysis_new(content, filename) -> dict:
    raw_data = content['list']
    analysis_result = {}
    a_result = True
    try:
        analysis(raw_data, analysis_result)
    except Exception as e:
        traceback.print_exc()
        a_result = False

    w_result = False
    if a_result:
        w_result = write2file(file_header, filename, analysis_result,type = 'json')
    analysis_result['result'] = a_result & w_result
    return analysis_result

def analysis(raw_data, result_dict) -> bool:
    columns = []
    for key in raw_data[0]:
        columns.append(key)
    array = []
    for d in raw_data:
        array.append([value for value in d.values()])
    raw_data = pd.DataFrame(array, index = range(1, 501), columns=columns)

    def cut_book_name(result):
        for index in range(len(result['book_name'])):
            v = result['book_name'][index]
            if len(v) > 15:
                v = v[: 15] + '...'
            result['book_name'][index] = v

    def hot_rank(raw_data):
        # 热度排行 hot_rank 
        # (comment_count * 0.6, star_count * 0.3, recommend * 0.1)
        # https://echarts.apache.org/examples/zh/editor.html?c=bar-y-category
        # https://echarts.apache.org/examples/zh/editor.html?c=bar-stack
        for index, rate in zip(['book_comment', 'book_star_count', 'book_recommend'], [0.6, 0.3, 0.1]):
            raw_data[index + '_new'] = raw_data[index] * rate
        raw_data['hot_index'] = raw_data['book_comment_new'] + raw_data['book_star_count_new'] + raw_data['book_recommend_new'] 
        need_columns = ['book_name', 'book_comment_new', 'book_star_count_new', 'book_recommend_new', 'hot_index']
        hot_rank_data = raw_data.sort_values(by='hot_index')[need_columns]
        top_10 = hot_rank_data.iloc[490: ].to_dict()
        avg_middle = hot_rank_data.iloc[10: 495].mean()
        avg_middle['book_name'] = '...'
        bottom_5 = hot_rank_data.iloc[:5].to_dict()
        result = {}
        # x_axis book_name: []
        for list_type in need_columns:
            result[list_type] = list(bottom_5[list_type].values()) + [avg_middle[list_type]] + list(top_10[list_type].values()) 
        # y_axis book_comment_new: [] ...
        cut_book_name(result)
        return result

    def cdrscsl(raw_data):
        # 指标雷达
        # cdrscsl (comment_discounted_recommend_star_count_star_level)
        # https://echarts.apache.org/examples/zh/editor.html?c=radar
        index_name_list = ['book_name', 'book_comment', 'book_discounted', 'book_recommend', 'book_star_count', 'book_star_level']
        cdrscsl_data = raw_data[index_name_list].iloc[:5]
        avg_data = raw_data[index_name_list].mean()
        result = []
        for index in range(0, 5):
            book_name = cdrscsl_data['book_name'].iloc[index]
            if len(book_name) > 10:
                book_name = book_name[:7] + '...'
            result.append({"name": book_name, "cdrscsl": [
                cdrscsl_data['book_comment'].iloc[index],
                10 - cdrscsl_data['book_discounted'].iloc[index],
                cdrscsl_data['book_recommend'].iloc[index],
                cdrscsl_data['book_star_count'].iloc[index],
                cdrscsl_data['book_star_level'].iloc[index],
            ]})
        result.append({"name": 'avg', "cdrscsl": avg_data.to_list()})
        return result

    def star_price_rate(raw_data):
        # 星价比排行 
        # star_price_rate (star_level(五星级别) / 折后价)
        # https://echarts.apache.org/examples/zh/editor.html?c=pictorialBar-bar-transition
        need_columns = ['book_name', 'book_star_level', 'book_discounted_price']
        rate_data = raw_data[need_columns]
        rate_data['star_price_rate'] = rate_data['book_star_level'] / rate_data['book_discounted_price']
        rate_data = rate_data.sort_values(by='star_price_rate')
        rate_data = rate_data.iloc[490:].to_dict()
        result = {}
        for list_type in rate_data.keys():
            result[list_type] = list(rate_data[list_type].values())
        cut_book_name(result)
        return result

    def author_rank(raw_data):
        # 作家排行 
        # author_rank (book_counts || avg_star_level)
        # https://echarts.apache.org/examples/zh/editor.html?c=bar-polar-label-radial
        need_columns = ['book_author', 'book_star_level']
        author_data = raw_data[need_columns]
        author_list = {'author': [], 'book_star_level': [], 'count': []}
        index = 0
        for line in author_data['book_author']:
            if len(line) > 0:
                author_list['author'].append(line[0])
                author_list['book_star_level'].append(author_data.iloc[index]['book_star_level'])
                author_list['count'].append('1')
            index += 1         
        author_df = pd.DataFrame(author_list)
        author_df = author_df.groupby(by = 'author').agg({'count': np.count_nonzero, 'book_star_level': np.average})
        author_df = author_df.sort_values(by = ['count', 'book_star_level']).iloc[-5:].to_dict()
        result = {'author': list(author_df['count'].keys())}
        for list_type in ['count', 'book_star_level']:
            result[list_type] = list(author_df[list_type].values())
        return result

    def press_time(raw_data):
        # 出版时间序列数量
        # press_time (book_counts)
        # https://echarts.apache.org/examples/zh/editor.html?c=line-marker
        need_columns = ['book_publish_time']
        press_rank = raw_data[need_columns]
        press_rank = press_rank.groupby(by = 'book_publish_time').value_counts().sort_index()
        press_rank = press_rank.to_dict()
        result = {}
        result['time_s'] = list(press_rank.keys())
        result['count'] = list(press_rank.values())
        return result

    def press_rank(raw_data):
        # 出版社排行
        # press_rank (book_counts)
        # https://echarts.apache.org/examples/zh/editor.html?c=pie-roseType-simple
        need_columns = ['book_publish_press']
        press_rank = raw_data[need_columns]
        press_rank = press_rank.groupby(by = 'book_publish_press').value_counts().sort_values()
        top_5 = press_rank[-5:].to_dict()
        other = press_rank[:-5].sum()
        result = top_5
        result['other'] = other
        return result

    def e_price_rank(raw_data):
        # 电子书平均价格
        # e_price_rank (e_price)
        # https://echarts.apache.org/examples/zh/editor.html?c=gauge-simple
        e_price = raw_data[raw_data['book_e_price'] > 0]['book_e_price'].mean()
        return {'e_price': e_price}

    def star_count(raw_data):
        # 五星评分数  
        # star_count ( >= 100000 完美 >= 5000 < 100000 好 < 5000 普通) 
        # 图形 https://echarts.apache.org/examples/zh/editor.html?c=gauge-ring
        stars = raw_data['book_star_count']
        all_count = stars.sum()
        p_low = 100000
        g_low = 5000
        p_count = stars[stars >= p_low].sum()
        g_count = stars[stars >= g_low][stars < p_low].sum()
        c_count = stars[stars < p_low].sum()
        return {'p_rate': p_count / all_count ,'g_rate': g_count / all_count,'c_rate': c_count / all_count}

    result_dict['hot_rank'] = hot_rank(raw_data)
    result_dict['cdrscsl'] = cdrscsl(raw_data)
    result_dict['star_price_rate'] = star_price_rate(raw_data)
    result_dict['author_rank'] = author_rank(raw_data)
    result_dict['press_rank'] = press_rank(raw_data)
    result_dict['e_price_rank'] = e_price_rank(raw_data)
    result_dict['star_count'] = star_count(raw_data)
    result_dict['press_time'] = press_time(raw_data)


