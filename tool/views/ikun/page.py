from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render
from tool.views.ikun.crawl import CrawlIKun

class IKunCrawlerPage(APIView):

    def get(self, request):
        data = request.GET
        re_type = data.get('type', 'page')
        if re_type == 'page':
            return render(request, 'tool/ikuncrawler/index.html')
        else:
            return self.crawl()
        
    def crawl(self):
        cik = CrawlIKun()
        result = cik.start()
        return Response(result)
