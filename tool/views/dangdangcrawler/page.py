from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render
from tool.views.dangdangcrawler.crawl import crawl, data_analysis

class DangDangCrawlerPage(APIView):

    def get(self, request):
        data = request.GET
        re_type = data.get('type', 'page')
        if re_type == 'page':
            return render(request, 'tool/dangdangcrawler/index.html')
        else:
            return self.crawl()
        
    def crawl(self):
        result, content, date, url = crawl()
        if result:
            result_dict = data_analysis(content)
            result = result & result_dict['result']
            if result_dict['result']:
                for key, value in result_dict.items():
                    if key != 'result':
                        content[key] = value
        return Response({'result': result, 'content': content, 'date': date, 'url': url})
