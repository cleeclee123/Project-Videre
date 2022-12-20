import requests

def extract(proxy):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0'}
    try:
        r = requests.get('https://httpbin.org/ip', headers=headers,
                         proxies={'http': proxy, 'https': proxy}, timeout=2)
        print(r.json(), ' | Works')
    except:
        print("error with proxy")

print(extract("https://113.57.178.157:443"))