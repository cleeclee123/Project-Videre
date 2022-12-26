import requests
from bs4 import BeautifulSoup
import random
import concurrent.futures
import asyncio

# get the list of free proxies
def getProxies():
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


def check(proxy):
    #state = False
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0'}
    try:
        r = requests.get('https://httpbin.org/ip', headers=headers,
                         proxies={'http': proxy, 'https': proxy}, timeout=2)
        print(f'response {r.json()}, {r.status_code}, proxy: {proxy}')
        # state = True
    except requests.ConnectionError as err:
        print(f'error with {proxy}')
    return proxy

async def checkAll():
    proxies = []
    list = await getProxies()
    for i in range(len(list)):
        state = await check(list[i]) 
        if (state == True):
            proxies.append(list[i])
    return proxies

proxylist = getProxies()
with concurrent.futures.ThreadPoolExecutor() as executor:
    executor.map(check, proxylist)

# asyncio.run(checkAll())