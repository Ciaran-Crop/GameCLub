from selenium import webdriver
from selenium.webdriver.common.by import By 
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
import os
from tool.views.crawl_analysis import CrawlAnalysisHandle
from acapp.settings import BASE_DIR
import random
import datetime
import pandas as pd
import numpy as np
import jieba

class CrawlIKun(CrawlAnalysisHandle):
    def __init__(self):
        super().__init__("ikuncrawler")
        self.executable_path = os.path.join('/usr', 'local', 'share', 'chromedriver')
        self.chrome_options = Options()
        self.chrome_options.add_argument('--headless')
        self.chrome_options.add_argument('--disable-gpu')
        self.chrome_options.add_experimental_option('excludeSwitches', ['enable-automation'])
        self.chrome_options.add_experimental_option('useAutomationExtension', False)
        self.chrome_options.add_argument('--no-sandbox')
        self.chrome_options.add_argument('--disable-dev-shm-usage')
        self.chrome_options.add_argument("--window-size=1920,1080")
        self.data['list'] = []
        self.timeout = 0
        self.limit = 3
        self.next = True

    def check_timeout(self):
        if self.timeout > self.limit:
            self.browser.quit()
            raise Exception("timeout more than ", self.limit)
        self.timeout += 1

    def crawl_new(self):
        try:
            self.browser = webdriver.Chrome(executable_path=self.executable_path, chrome_options=self.chrome_options)
            self.WAIT = WebDriverWait(self.browser, 10)
            self.browser.get('https://www.bilibili.com/')
            self.search()
            index = 1
            while self.next:
                print("crawl page", index)
                time.sleep(random.randint(0, 1))
                self.get_one_page(index)
                index += 1
            self.browser.quit()
        except TimeoutException:
            self.check_timeout()
            self.browser.refresh()
        except Exception as e:
            self.browser.quit()
            raise e

    def search(self):
        try:
            input = self.WAIT.until(EC.presence_of_element_located((By.CSS_SELECTOR, '#nav-searchform > div.nav-search-content > input')))
            search_button = self.WAIT.until(EC.element_to_be_clickable((By.CSS_SELECTOR, '#nav-searchform > div.nav-search-btn')))
            input.send_keys("蔡徐坤")
            search_button.click()
            window_handler = self.browser.window_handles
            self.browser.switch_to.window(window_handler[1])
            time.sleep(2)
        except TimeoutException:
            self.check_timeout()
            return self.search()

    def get_items(self, soup):
        next_page = soup.find(class_='vui_pagenation--btns').find_all('button')[-1]
        if next_page.text == '下一页' and "vui_button--disabled" in next_page.get('class'):
            self.next = False
        video_list = soup.find(class_='video-list').find_all('div', class_="bili-video-card__wrap")
        for video in video_list:
            video_url = video.find('a').get('href')
            video_photo = video.find('picture').find('img').get('src')
            video_mask = video.find(class_='bili-video-card__mask')
            video_duration = video_mask.find(class_='bili-video-card__stats__duration').text
            video_views = video_mask.find_all(class_='bili-video-card__stats--item')[0].text
            video_barrages = video_mask.find_all(class_='bili-video-card__stats--item')[1].text
            video_title = video.find(class_='bili-video-card__info--tit').text
            video_author = video.find(class_='bili-video-card__info--author').text
            video_author_url = video.find(class_='bili-video-card__info--owner').get('href')
            video_publish_time = video.find(class_='bili-video-card__info--date').text
            self.data['list'].append({
                'url': "http:" + video_url, 
                'photo': "http:" +  video_photo,
                'duration': video_duration,
                'views': video_views,
                'barrages': video_barrages,
                'title': video_title,
                'author': video_author,
                'author_url': "http:" +  video_author_url,
                'publish_time': video_publish_time.split(' ')[-1],
            })

    def get_one_page(self, page):
        try:
            page_num = self.WAIT.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.vui_pagenation--btns .vui_button--active')))
            page_num = int(page_num.text)
            if page_num != page:
                self.change_page(page)
            self.WAIT.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.vui_pagenation--btns .vui_button--active')))
            self.WAIT.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.video-list')))
            html = self.browser.page_source
            soup = BeautifulSoup(html, 'lxml')
            self.get_items(soup)
        except TimeoutException:
            self.check_timeout()
            self.browser.refresh()
            return self.get_one_page(page)

    def change_page(self, page):
        try:
            page_num = self.WAIT.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.vui_pagenation--btns .vui_button--active')))
            page_num = int(page_num.text)
            if page_num == page:
                return True
            elif page_num < page:
                next_page_button = self.WAIT.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.vui_pagenation--btns > button:nth-last-child(1)')))
                next_page_button.click()
            elif page_num > page:
                pre_page_button = self.WAIT.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.vui_pagenation--btns > button:nth-child(1)')))
                pre_page_button.click()
            page_num = self.WAIT.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.vui_pagenation--btns .vui_button--active')))
            page_num = int(page_num.text)
            if page_num != page:
                return self.change_page(page)
        except TimeoutException:
            self.check_timeout()
            self.browser.refresh()
            return self.change_page(page)

    def title_word_cloud(self, raw_data):
        # title_word_cloud
        # https://github.com/ecomfe/echarts-wordcloud
        def load_stop_word():
            file_name = os.path.join(BASE_DIR, 'media', 'tool', 'IKUN', 'stopwords.txt')
            stop_word = []
            with open(file_name, encoding='utf8', mode='r') as f:
                for line in f.readlines():
                    stop_word.append(line.strip())
            return stop_word
        
        stop_word = load_stop_word()
        title_data = raw_data['title']
        word_dict = {}
        for title in title_data:
            words = jieba.lcut(title)
            for word in words:
                if word in stop_word or word.strip() == "":
                    continue
                word_dict[word] = word_dict.get(word, 0) + 1
        self.analysis_data['title_word_cloud'] = word_dict

    def views_barrages(self, raw_data):
        ret = {}
        # views_barrages_duration_total
        # https://echarts.apache.org/examples/zh/editor.html?c=gauge-stage
        ret['views_total'] = raw_data['views'].sum()
        ret['barrages_total'] = raw_data['barrages'].sum()
        ret['duration'] = raw_data['duration'].sum()
        # views_barrages_top_10 hot_index
        # https://echarts.apache.org/examples/zh/editor.html?c=bar-y-category-stack
        need_columns = ['views', 'barrages']
        raw_data['total'] = raw_data[need_columns[0]] + raw_data[need_columns[1]]
        top10 = raw_data.sort_values(by = 'total')[-10: ]
        top10 = top10[need_columns + ['total', 'bv', 'author']]
        top10 = top10.to_dict()
        ret['top10'] = {}
        for key in top10.keys():
            values = list(top10[key].values())
            ret['top10'][key] = values
        # views_barrages_area
        # https://echarts.apache.org/examples/zh/editor.html?c=area-stack-gradient
        vba_time_series = raw_data[need_columns + ['publish_time']]
        vba_time_series = vba_time_series.sort_values(by = 'publish_time')
        ret['vba_time_series'] = {}
        ret['vba_time_series']['views'] = list(vba_time_series['views'].to_dict().values())
        ret['vba_time_series']['barrages'] = list(vba_time_series['barrages'].to_dict().values())
        ret['vba_time_series']['time_series'] = list(vba_time_series['publish_time'].to_dict().values())
        self.analysis_data['views_barrages'] = ret

    def time_count_max_views_barrages(self, raw_data):
        # time_count
        # time_max_views_barrages
        # https://echarts.apache.org/examples/zh/editor.html?c=line-marker
        ret = {}
        time_count = raw_data[['bv', 'views', 'barrages', 'publish_time']]
        time_count = time_count.groupby(by = 'publish_time').agg({'bv': np.count_nonzero, 'views': np.max, 'barrages': np.max})
        time_count = time_count.sort_values(by = 'publish_time')
        ret['time_series'] = list(time_count.index)
        ret['count'] = list(time_count['bv'].to_dict().values())
        ret['max_views'] = list(time_count['views'].to_dict().values())
        ret['barrages'] = list(time_count['barrages'].to_dict().values())
        self.analysis_data['time_count_max_views_barrages'] = ret

    def up_count(self, raw_data):
        ret = {}
        up_c = raw_data[['author_url', 'author', 'bv']]
        up_c = up_c.groupby(by = 'author_url').agg({'bv': np.count_nonzero, 'author': np.max})
        up_c = up_c.sort_values(by = 'bv')[-50:]
        ret['count'] = list(up_c['bv'].to_dict().values())
        ret['author'] = list(up_c['author'].to_dict().values())
        self.analysis_data['up_count'] = ret

    def analysis_new(self):
        raw_data = self.data['list']
        raw_data = self.clean_data(raw_data)
        raw_data = self.create_dataframe(raw_data)

        self.title_word_cloud(raw_data)
        self.views_barrages(raw_data)
        self.time_count_max_views_barrages(raw_data)
        self.up_count(raw_data)

    def clean_data(self, raw_data):
        new_raw_data = []
        c_d = {}
        for index in range(len(raw_data)):
            value = raw_data[index]
            # bv / av
            bv = value['url'].split('/')[-1]
            if bv == '':
                bv = value['url'].split('/')[-2]
            if not c_d.get(bv, "") == "":
                continue
            c_d[bv] = 1
            value['bv'] = bv
            # duration to s
            duration = value['duration'].split(':')
            duration = duration[::-1]
            new_duration = 0
            time_trans = [1, 60, 60 * 60, 24 * 60 * 60]
            for index in range(len(duration)):
                new_duration += int(duration[index]) * time_trans[index]
            value['duration'] = new_duration
            # views & barrages
            views = value['views']
            if views[-1] == '万':
                views = float(views[:-1]) * 10000
            else:
                views = float(views)
            value['views'] = views
            barrages = value['barrages']
            if barrages[-1] == '万':
                barrages = float(barrages[:-1]) * 10000
            else:
                barrages = float(barrages)
            value['barrages'] = barrages
            # publish_time
            publish_time = value['publish_time']
            now_date = datetime.datetime.now()
            if publish_time[-1] == '前':
                if publish_time[-3: -1] == '小时':
                    now_date = (now_date + datetime.timedelta(hours=-int(publish_time[:-3])))
                    now_date = now_date.strftime('%Y-%m-%d')
                    publish_time = now_date
                elif publish_time[-3: -1] == '分钟':
                    now_date = (now_date + datetime.timedelta(minutes=-int(publish_time[:-3])))
                    now_date = now_date.strftime("%Y-%m-%d")
                    publish_time = now_date
            if len(publish_time.split('-')) <= 2:
                publish_time = str(datetime.datetime.now().year) + '-' + publish_time
            if publish_time[-2:] == '昨天':
                now_date = (now_date + datetime.timedelta(days=-1))
                now_date = now_date.strftime("%Y-%m-%d")
                publish_time = now_date
            elif publish_time[-2:] == '今天':
                now_date = now_date.strftime("%Y-%m-%d")
                publish_time = now_date
            publish_time = datetime.datetime.strptime(publish_time, "%Y-%m-%d")
            publish_time = publish_time.strftime("%Y-%m-%d")
            value['publish_time'] = publish_time
            new_raw_data.append(value)
        return new_raw_data

