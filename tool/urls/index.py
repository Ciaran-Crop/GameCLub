from django.urls import path, include
from tool.views.index import ToolList

urlpatterns = [
    path('get_tool_list/', ToolList.as_view(), name='get_tool_list'),
]
