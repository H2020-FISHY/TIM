from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
import requests
import json

from requests_futures.sessions import FuturesSession
from requests import Session

with open("../../vagrant/config/default.json", "r") as read_file:
    config = json.load(read_file)
    print(f'http://{config["ansibleRunner"]["ip"]}:{config["ansibleRunner"]["port"]}/callAnsibleDeploy')

def home(request):
    template = loader.get_template('home/index.html')
    context = {
        'title' : 'Home'
    }
    return HttpResponse(template.render(context, request))

def sendRequest(self):
    session = FuturesSession()

    def response_hook(resp, *args, **kwargs):
        # parse the json storing the result on the response object
        resp.data = resp.json()

    future = session.get(f'http://{config["ansibleRunner"]["ip"]}:{config["ansibleRunner"]["port"]}/callAnsibleDeploy', hooks={
        'response': response_hook,
    })

    
    #r = requests.get(f'http://{config["ansibleRunner"]["ip"]}:{config["ansibleRunner"]["port"]}/callAnsibleDeploy')
    return redirect('checkStatus')

def checkStatus(request):

    session = Session()
    r = session.get(f'http://{config["ansibleRunner"]["ip"]}:{config["ansibleRunner"]["port"]}/statusCheck')
    r = r.content
    #r = requests.get(f'http://{config["ansibleRunner"]["ip"]}:{config["ansibleRunner"]["port"]}/statusCheck').json()

    template = 'home/checkStatus.html'
    context = {
        'title' : 'Checking status',
        'response' : r
    }

    return render(request, template, context)
    #return HttpResponse(template.render(context, request))