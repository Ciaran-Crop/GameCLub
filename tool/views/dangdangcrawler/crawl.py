import requests
import re
import pandas as pd
import numpy as np
from tool.views.crawl_analysis import CrawlAnalysisHandle

class DangDangCrawler(CrawlAnalysisHandle):
    def __init__(self):
        super().__init__('dangdangcrawler')
        self.header = {
            "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding":"gzip, deflate",
            "Accept-Language":"zh-CN,zh;q=0.9",
            "Cache-Control":"max-age=0",
            "Proxy-Connection":"keep-alive",
            "Upgrade-Insecure-Requests":"1",
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        }

    def crawl_one_page(self, url):
        response = requests.get(url, headers=self.header)
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
                'book_author': self.process_author(item[7].strip()),
                'book_publish_time': item[8].strip(),
                'book_publish_press': item[9].strip(),
                'book_star_count': int(item[10].strip()),
                'book_discounted_price': self.process_price(item[11].strip()),
                'book_price': self.process_price(item[12].strip()),
                'book_discounted': float(item[13].strip()),
                'book_e_price': self.process_e_price(item[14].strip()),
            }

    def process_price(self, price):
        n_price = ''
        for little_p in price.split(','):
            n_price += little_p
        return float(n_price)

    def process_author(self, author):
        z_list = []
        pattern = re.compile(r'.*?>(.*?)</a>.*?')
        for name in re.findall(pattern, author):
            z_list.append(name)
        return z_list

    def process_e_price(self, e_price):
        pattern = re.compile(r'.*?&yen;(.*?)</span>',re.S)
        price = re.findall(pattern, e_price)
        if len(price) == 0:
            return 0
        return float(price[0])

    def crawl_new(self):
        base_url = "http://bang.dangdang.com/books/fivestars/01.00.00.00.00.00-recent30-0-0-1-"
        for i in range(1, 26):
            crawl_url = base_url + str(i)
            for line in self.crawl_one_page(crawl_url):
                self.data['list'].append(line)

    def analysis_new(self):
        raw_data = self.data['list']
        raw_data = self.create_dataframe(raw_data)
        
        self.analysis_data['hot_rank'] = self.hot_rank(raw_data)
        self.analysis_data['cdrscsl'] = self.cdrscsl(raw_data)
        self.analysis_data['star_price_rate'] = self.star_price_rate(raw_data)
        self.analysis_data['author_rank'] = self.author_rank(raw_data)
        self.analysis_data['press_rank'] = self.press_rank(raw_data)
        self.analysis_data['e_price_rank'] = self.e_price_rank(raw_data)
        self.analysis_data['star_count'] = self.star_count(raw_data)
        self.analysis_data['press_time'] = self.press_time(raw_data)

    def cut_book_name(self, result):
        for index in range(len(result['book_name'])):
            v = result['book_name'][index]
            if len(v) > 15:
                v = v[: 15] + '...'
            result['book_name'][index] = v

    def hot_rank(self, raw_data):
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
        self.cut_book_name(result)
        return result

    def cdrscsl(self, raw_data):
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

    def star_price_rate(self, raw_data):
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
        self.cut_book_name(result)
        return result

    def author_rank(self, raw_data):
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

    def press_time(self, raw_data):
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

    def press_rank(self, raw_data):
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

    def e_price_rank(self, raw_data):
        # 电子书平均价格
        # e_price_rank (e_price)
        # https://echarts.apache.org/examples/zh/editor.html?c=gauge-simple
        e_price = raw_data[raw_data['book_e_price'] > 0]['book_e_price'].mean()
        return {'e_price': e_price}

    def star_count(self, raw_data):
        # 五星评分数  
        # star_count ( >= 100000 完美 >= 5000 < 100000 好 < 5000 普通) 
        # 图形 https://echarts.apache.org/examples/zh/editor.html?c=gauge-ring
        stars = raw_data['book_star_count']
        all_count = stars.sum()
        p_low = 100000
        g_low = 5000
        p_count = stars[stars >= p_low].sum()
        g_count = stars[stars >= g_low][stars < p_low].sum()
        c_count = stars[stars < g_low].sum()
        return {'p_rate': p_count / all_count ,'g_rate': g_count / all_count,'c_rate': c_count / all_count}
