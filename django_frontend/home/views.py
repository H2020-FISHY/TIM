from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
import requests
import json
import ast
import os

from requests_futures.sessions import FuturesSession
from requests import Session
import json


# TODO: Change IPs in config file?

module_dir = os.path.dirname(__file__)
conf_path = os.path.join(module_dir, "../config/default.json")

with open(conf_path, "r") as read_file:
    config = json.load(read_file)
    print(f'http://{config["ansibleRunner_ip"]}:{config["ansibleRunner_port"]}/callAnsibleDeploy')

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

    future = session.get(f'http://{config["ansibleRunner_ip"]}:{config["ansibleRunner_port"]}/callAnsibleDeploy', hooks={
        'response': response_hook,
    })

    return redirect('checkStatus')

def checkStatus(request):

    session = Session()
    r = session.get(f'http://{config["ansibleRunner_ip"]}:{config["ansibleRunner_port"]}/statusCheck')
    r = r.content
    r = r.decode("UTF-8")
    r = ast.literal_eval(r)

    template = 'home/checkStatus.html'

    return render(request, template, r)

def reports(request):

    session = Session()
    r = session.get(f'http://{config["tar_ip"]}:{config["tar_port"]}/api/reports')
    r = r.content
    r = r.decode("UTF-8")
    r = ast.literal_eval(r)
    data = []
    for el in r:
        alert = json.loads(el['data'])
        alert = alert['attachments'][0]
        el['data'] = alert
        data.append(el)

    template = 'home/reports.html'

    return render(request, template, {'data': data})
