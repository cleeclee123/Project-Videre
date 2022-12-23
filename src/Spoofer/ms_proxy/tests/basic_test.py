import requests

def check(proxy):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0'}
    try:
        r = requests.get('https://httpbin.org/ip', headers=headers,
                         proxies={'http': proxy, 'https': proxy}, timeout=5)
        print(f'response: {r.json()}, {r.status_code}, proxy: {proxy}')
        if (r.json()['origin'] == proxy[0:proxy.index(':')]):
            return True
        return False
    except requests.ConnectionError as err:
        print(f'error with {proxy}')
        return False

print(check("49.0.2.242:8090"))
