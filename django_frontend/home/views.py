from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
import requests
import json

with open("../../vagrant/config/default.json", "r") as read_file:
    config = json.load(read_file)
    print(f'http://{config["ansibleRunner"]["ip"]}:{config["ansibleRunner"]["port"]}/callAnsibleDeploy')

# Create your views here.
def home(request):
    template = loader.get_template('home/index.html')
    context = {
        'title' : 'Home'
    }
    return HttpResponse(template.render(context, request))

def sendRequest(self):
    r = requests.get(f'http://{config["ansibleRunner"]["ip"]}:{config["ansibleRunner"]["port"]}/checkStatus')
    return redirect('home')
