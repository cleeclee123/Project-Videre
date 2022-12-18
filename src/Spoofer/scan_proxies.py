import socket
from itertools import product
import multiprocessing as mp
from time import time

# attempts to connect to socket with passed in ip address on passed in port
# true right away if port is open, to false if port is closed
def checkPort(ip, port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock.settimeout(1)
        sock.connect((ip, int(port)))
        sock.shutdown(2)
        return True
    except:
        return False

# loops thru http(s) ports and checks if able to connect,
def buildProxy(ip):
    proxies = []
    httpPorts = [80, 8080, 8008, 443]
    _start = time()
    for i in range(len(httpPorts)):
        if (checkPort(ip, httpPorts[i]) == True):
            if (httpPorts[i] == 443):
                proxies.append(f'https://{ip}:{httpPorts[i]}')
            else:
                proxies.append(f'http://{ip}:{httpPorts[i]}')
    print(f"completed in {time() - _start:.2f}")
    return proxies

def scanClassAProxies():
    for a in range(1, 127):
        for b in range(0, 256):
            for c in range(0, 256):
                for d in range(0, 256):
                    print(buildProxy(f'{a}.{b}.{c}.{d}'))

def scanClassBProxies():
    for a in range(128, 192):
        for b in range(0, 256):
            for c in range(0, 256):
                for d in range(0, 256):
                    print(buildProxy(f'{a}.{b}.{c}.{d}'))


def scanClassCProxies():
    for a in range(192, 224):
        for b in range(0, 256):
            for c in range(0, 256):
                for d in range(0, 256):
                    print(buildProxy(f'{a}.{b}.{c}.{d}'))
                    
def scanClassDProxies():
    for a in range(224, 239):
        for b in range(0, 256):
            for c in range(0, 256):
                for d in range(0, 256):
                    print(buildProxy(f'{a}.{b}.{c}.{d}'))
                    
def scanProxies(cores):
    with mp.Pool(cores) as pool:
        results = pool.starmap(buildProxy,
                               [(f'{a}.{b}.{c}.{d}') for a in range(1, 127)
                                for b in range(0, 256)
                                for c in range(0, 256)
                                for d in range(0, 256)])
    print(results)

if __name__ == "__main__":
    count = 0
    scanClassAProxies()
