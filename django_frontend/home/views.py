from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
import requests


# Create your views here.
def home(request):
    template = loader.get_template('home/index.html')
    context = {
        'title' : 'Home'
    }
    return HttpResponse(template.render(context, request))

def sendRequest(self):
    r = requests.get("http://192.168.55.11:10010/callAnsibleDeploy")
    return redirect('home')
