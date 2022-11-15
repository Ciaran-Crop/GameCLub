from django.shortcuts import render

def index(request):
    data = request.GET
    content = {
        'access': data.get('access', ""),
        'refresh': data.get('refresh', ""),
    }
    return render(request, 'superperson/multiends/web.html', content)
