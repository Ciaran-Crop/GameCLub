from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from gameclub.models.tools import Tool
from gameclub.models.user_profile import UserProfile

class ToolList(APIView):
    permision_classes = [(IsAuthenticated)]

    def get(self, request):
        data = request.GET
        user = request.user
        if data['type'] == 'all':
            return self.get_all_tools(user)
        else:
            return self.success_or_error('', True)

    def get_all_tools(self, user):
        tools = Tool.objects.all()
        tools_list = []
        for tool in tools:
            if tool.get_permissions() == tool.ONLY_AUTHOR and not tool.is_author(user.username):
                continue
            tools_list.append({
                'name': tool.get_name(),
                'types': tool.get_types(),
                'photo': tool.get_photo(),
                'url': tool.get_url(),
            })
        return self.success_or_error(tools_list)

    def success_or_error(self, content, is_error = False):
        result = 'success'
        if is_error:
            result = 'fail'
        return Response({
            'result': result,
            'content': content,
        })
