from django.urls import path, include
from tool.views.index import ToolList
from tool.views.dangdangcrawler.page import DangDangCrawlerPage
from tool.views.ikun.page import IKunCrawlerPage

urlpatterns = [
    path('get_tool_list/', ToolList.as_view(), name='get_tool_list'),
    path('dangdangcrawler/', DangDangCrawlerPage.as_view(), name = 'dandancrawler'),
    path('ikuncrawler/', IKunCrawlerPage.as_view(), name = 'ikun_crawler'),
    
]
