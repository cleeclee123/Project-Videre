import requests
from bs4 import BeautifulSoup
import random
import concurrent.futures
import asyncio

# get the list of free proxies


def getProxiesList():
    # r = requests.get('https://free-proxy-list.net/')
    r = requests.get('https://www.sslproxies.org/')
    soup = BeautifulSoup(r.content, 'html.parser')
    table = soup.find('tbody')
    proxies = []
    for row in table:
        if row.find_all('td')[4].text == 'elite proxy':
            proxy = ':'.join([row.find_all('td')[0].text,
                             row.find_all('td')[1].text])
            proxies.append(proxy)
        else:
            pass
    return proxies


def getProxiesGithub():
    # r = requests.get('https://github.com/TheSpeedX/PROXY-List/blob/master/socks5.txt')    
    # r = requests.get('https://github.com/jetkai/proxy-list/blob/main/online-proxies/txt/proxies-socks5.txt')    
    r = requests.get('https://github.com/TheSpeedX/PROXY-List/blob/master/http.txt')    
    soup = BeautifulSoup(r.content, 'html.parser')
    table = soup.find('table')
    proxies = []
    if (table.find_all('tr')):
        for row in table.find_all('tr'):
            proxies.append(row.select('tr > td')[1].text)
    return proxies

def checkHttp(proxy):
    # state = False
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0'}
    try:
        r = requests.get('https://httpbin.org/ip', headers=headers,
                         proxies={'http': proxy, 'https': proxy}, timeout=2)
        return True
        #print(f'response {r.json()}, {r.status_code}, proxy: {proxy}')
    except requests.ConnectionError as err:
        return False
        #print(f'error with {proxy}')

def checkGoogle(proxy):
    # state = False
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0'}
    try:
        r = requests.get('https://www.google.com/', headers=headers,
                         proxies={'http': proxy, 'https': proxy}, timeout=2)
        return True
        #print(f'response {r.json()}, {r.status_code}, proxy: {proxy}')
    except requests.ConnectionError as err:
        return False
        #print(f'error with {proxy}')

def check(proxy):
    if (checkHttp(proxy) and checkGoogle(proxy)):
        print(f'{proxy} http and google')
    elif (checkHttp(proxy) and not checkGoogle(proxy)):
        print(f'{proxy} http')
    elif (not checkHttp(proxy) and checkGoogle(proxy)):
        print(f'{proxy} google')
    else:
        None

proxylist = getProxiesGithub()
with concurrent.futures.ThreadPoolExecutor(max_workers=64) as executor:
    executor.map(check, proxylist)
