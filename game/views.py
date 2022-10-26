from django.http import HttpResponse


def index(requset):
    line = "<h1 style='text-align: center'>超级人类</h1>"
    line2 = "<img src='https://ts1.cn.mm.bing.net/th/id/R-C.f73f80276a586e2683f527dde83fa56c?rik=AZ8thT0UDGw69w&riu=http%3a%2f%2fwww.guangyuanol.cn%2fuploads%2fallimg%2f210803%2f23045JE5-0-lp.jpg&ehk=xKeR1BrVBV%2fHIZdaxEO3WvKOx0EPH1t7crjj%2fp1pQAM%3d&risl=&pid=ImgRaw&r=0' style='margin: auto; display: block; width:1000px; heigh: 500px'>"

    return HttpResponse(line + line2)


