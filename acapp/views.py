from django.http import HttpResponse


def index(request):
    line = "<h3 style='text-align: left; color:CornflowerBlue; margin-top: 40; margin-left: 10'>游戏菜单</h3>\n<hr>"
    line1 = "<a href='superperson/' style='text-decoration: none;'><span style='color:LightPink; margin-top: 50; margin-left: 20;'>超级人类</span></a>"
    return HttpResponse(line + line1)
