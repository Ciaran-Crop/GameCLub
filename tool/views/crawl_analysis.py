import os
import datetime
import traceback
import pandas as pd
import numpy as np
from tool.views.common import write2file, read4file, clean_json, get_analysis_json_from_date, get_latest_date

class CrawlAnalysisHandle:
    def __init__(self, file_header, duration_date = 31):
        """
            Parameters:
                file_header: tool_file_path_header -> str
                duration_date: crawl_duration_time(days), default 31 -> int 
        """
        self.file_header = file_header
        self.duration_date= duration_date
        self.data = {}
        self.analysis_data = {}
        self.last_crawl_date = datetime.datetime.fromisoformat('2001-05-01T00:00:01.000001')
        self.last_crawl_date = get_latest_date(self.file_header, self.last_crawl_date)

    def crawl(self):
        self.last_crawl_date =  get_latest_date(self.file_header, self.last_crawl_date)
        now_date = datetime.datetime.now()
        if (now_date - self.last_crawl_date).days > self.duration_date:
            clean_json(self.file_header)
            d = '-'.join([str(now_date.year),str(now_date.month), str(now_date.day)])
            filename = '-'.join([str(now_date.year),str(now_date.month), str(now_date.day)]) + '.json'
            url = os.path.join('media', 'tool', self.file_header, filename)
            try:
                self.crawl_new()
                write2file(self.file_header, filename, self.data, type='json')
                self.last_crawl_date = now_date
            except:
                traceback.print_exc()
                return False, None, None
            return True, d, url
        else:
            d = '-'.join([str(self.last_crawl_date.year),str(self.last_crawl_date.month), str(self.last_crawl_date.day)])
            filename = '-'.join([str(self.last_crawl_date.year),str(self.last_crawl_date.month), str(self.last_crawl_date.day)]) + '.json'
            result, content = read4file(self.file_header, filename, type = 'json')
            url = os.path.join('media', 'tool', self.file_header, filename)
            self.data = content
            return result, d, url

    def crawl_new(self):
        """
            overwrite this funtion to crawl new data
            !!! import: padding self.data
        """

    def create_dataframe(self, raw_data):
        columns = []
        for key in raw_data[0]:
            columns.append(key)
        array = []
        for d in raw_data:
            array.append([value for value in d.values()])
        raw_data = pd.DataFrame(array, index = range(1, len(raw_data) + 1), columns=columns)
        return raw_data

    def analysis(self):
        self.last_crawl_date =  get_latest_date(self.file_header, self.last_crawl_date)
        analysis_json_result, filename = get_analysis_json_from_date(self.last_crawl_date, self.file_header)
        if not analysis_json_result:
            try:
                self.analysis_new()
                write2file(self.file_header, filename, self.analysis_data ,type = 'json')
            except Exception:
                traceback.print_exc()
                return False
            return True
        else:
            filename = '-'.join([str(self.last_crawl_date.year),str(self.last_crawl_date.month), str(self.last_crawl_date.day), 'analysis']) + '.json'
            result, analysis_result = read4file(self.file_header, filename, 'json')
            self.analysis_data = analysis_result
            return result
    
    def analysis_new(self):
        """
            overwrite this funtion to analysis new data 
            !!! import: padding self.analysis_data')
        """
    
    def start(self):
        # crawl
        result, date, url = self.crawl()
        # analysis
        if result:
            analysis_result = self.analysis()
            if analysis_result:
                return {'result': True, 'data': self.data, 'analysis_data': self.analysis_data, 'date': date, 'url': url}
        return {'result': False, 'data': None, 'analysis_data': None, 'data': None, 'url': None}
