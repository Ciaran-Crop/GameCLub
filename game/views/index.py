from django.shortcuts import render

def index(request):
    return render(request, 'superperson/multiends/web.html')
