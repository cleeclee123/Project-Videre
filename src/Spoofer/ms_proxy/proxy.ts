import * as net from "net";
import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";
import * as ip from "./ipaddress.js";
import { IPInfo } from "./ipaddress.js";
import { Queue } from "../lib/queue.js";
import { application } from "express";

type ProxyParts = {
  protocol: string;
  host: string;
  port: string;
  proxyString: string;
  httpbinTest: boolean;
  googleTest: boolean;
};

type ProxiesInfo = {
  ipInfo: IPInfo;
  proxies: Array<ProxyParts>;
};

export class Proxy {
  private capacity_: number;
  private count_: number;
  private queue_: Queue<ProxiesInfo>;
  private currentHost_: string;
  private currentPort_: string;
  private dateCreated_: Date;
  private localAddress_: string;

  constructor(capacity: number) {
    this.capacity_ = capacity;
    this.count_ = 0;
    this.queue_ = new Queue<ProxiesInfo>(capacity);
    this.currentHost_ = "";
    this.currentPort_ = "";
    this.dateCreated_ = new Date();
    this.localAddress_ = "";
  }

  /**
   * tests if proxies work by checking current ip address on httpbin
   * @param proxy 
   * @returns 
   */
  testHTTPBin = async (proxy: string) => {
    let config = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0",
      },
      agent: new HttpsProxyAgent.HttpsProxyAgent(proxy),
    };
    try {
      return await fetch(`https://httpbin.org/ip`, config).then(
        async (response) => {
          let data: any = await response.json();
          if (
            proxy.substring(proxy.indexOf("/") + 2, proxy.indexOf(":", 6)) ===
            data["origin"]
          ) {
            return true;
          }
          return false;
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  testGoogle = (proxy: string) => {};

  /**
   * attempts to connect to socket with passed in ip address on passed in port
   * resolves promise to true right away if port is open, to false if port is closed
   * @param host, passed in ip address (string)
   * @param port, passed in port number (string but node net wants it a number)
   */
  checkPort = (host: string, port: string, t: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      // opens socket connection
      let connection: net.Socket = net.connect(Number(port), host, () => {
        connection.destroy();
        resolve(true);
      });

      // handle timeout error
      setTimeout(() => {
        connection.destroy();
        resolve(false);
      }, t);

      // handle socket connection error
      connection.on("error", (error) => {
        console.log(error);
        resolve(false);
      });
    });
  };

  /**
   * callback/promise helper to build proxy
   * @param host
   * @param port
   * @returns Promise<String> proxy string
   */
  buildProxyHelper = async (
    host: string,
    port: string
  ): Promise<ProxyParts> => {
    return await this.checkPort(host, port, 1000).then(async (data) => {
      return new Promise(async (resolve, reject) => {
        let current = {} as ProxyParts;
        if (data) {
          if (port === String(443)) {
            current.host = host;
            current.port = port;
            current.protocol = "https";
            current.proxyString = `https://${host}:${String(port)}`;
            current.httpbinTest = false;
            current.googleTest = false;
            if (await this.testHTTPBin(`https://${host}:${String(port)}`)) {
              current.httpbinTest = true;
            }
            // if (await this.testGoogle(`https://${host}:${String(port)}`)) {
            //   current.googleTest = true;
            // }
            resolve(current);
          } else {
            current.host = host;
            current.port = port;
            current.protocol = "http";
            current.proxyString = `http://${host}:${String(port)}`;
            current.httpbinTest = false;
            current.googleTest = false;
            if (await this.testHTTPBin(`http://${host}:${String(port)}`)) {
              current.httpbinTest = true;
            }
            // if (await this.testGoogle(`https://${host}:${String(port)}`)) {
            //   current.googleTest = true;
            // }
            resolve(current);
          }
        }
        resolve(current);
      })
    });
  };

  /**
   * loops thru http(s) ports and checks if able to connect, callback hell is inevitable
   * @param host
   * @returns Promise<Array<String>> array of proxies associated with the host
   */
  buildProxy = async (host: string): Promise<Promise<ProxyParts>[]> => {
    const kHttpPorts: Array<number> = [80, 8080, 8008, 443];
    let res = kHttpPorts.map((port) => {
      return this.buildProxyHelper(host, String(port))
    });
    return res;
  };

  /**
   * generation for class a proxies
   */
  generateProxyClassA = async (): Promise<void> => {
    while (this.count_ < this.capacity_) {
      let proxyInfo = {} as ProxiesInfo;
      proxyInfo.ipInfo = ip.generateClassA();
      await this.buildProxy(proxyInfo.ipInfo.ipaddress).then(
        async (proxies) => {
          let check: ProxyParts[] = [];
          if (proxies.length != 0) {
            let tempCheck: ProxyParts;
            proxies.forEach((proxy) => {
              proxy.then((p) => {
                // tempCheck.
                // tempCheck.httpbinTest = testHTTPBin(proxy);
                // tempCheck.googleTest = testGoogle(proxy);
                // check.push(tempCheck);
              })
            });
            this.queue_.enqueue(proxyInfo);
            this.count_++;
          }
        }
      );
      console.log(
        `scanning ${proxyInfo.ipInfo.ipaddress} current count ${this.count_} CLASS A`
      );
    }
    console.log("CLASS A scan done");
  };

  /**
   * generation for class b proxies
   */
  // generateProxyClassB = async (): Promise<void> => {
  //   while (this.count_ < this.capacity_) {
  //     let proxyInfo = {} as ProxiesInfo;
  //     proxyInfo.ipInfo = ip.generateClassB();
  //     await this.buildProxy(proxyInfo.ipInfo.ipaddress).then(async (data) => {
  //       if (data.length != 0) {
  //         proxyInfo.proxies = data;
  //         this.queue_.enqueue(proxyInfo);
  //         this.count_++;
  //         // console.log(`count updated ${this.count_}`);
  //         if (this.count_ === this.capacity_) {
  //           console.log("cap hit");
  //         }
  //       }
  //     });
  //     console.log(
  //       `scanning ${proxyInfo.ipInfo.ipaddress} current count ${this.count_} CLASS B`
  //     );
  //   }
  //   console.log("CLASS B scan done");
  // };

  /**
   * generation for class c proxies
   */
  // generateProxyClassC = async (): Promise<void> => {
  //   while (this.count_ < this.capacity_) {
  //     let proxyInfo = {} as ProxyInfo;
  //     proxyInfo.ipInfo = ip.generateClassC();
  //     await this.buildProxy(proxyInfo.ipInfo.ipaddress).then(async (data) => {
  //       if (data.length != 0) {
  //         proxyInfo.proxies = data;
  //         this.queue_.enqueue(proxyInfo);
  //         this.count_++;
  //         // console.log(`count updated ${this.count_}`);
  //         if (this.count_ === this.capacity_) {
  //           console.log("cap hit");
  //         }
  //       }
  //     });
  //     console.log(
  //       `scanning ${proxyInfo.ipInfo.ipaddress} current count ${this.count_} CLASS C`
  //     );
  //   }
  //   console.log("CLASS C scan done");
  // };

  /**
   * generation for class d proxies
   */
  // generateProxyClassD = async (): Promise<void> => {
  //   while (this.count_ < this.capacity_) {
  //     let proxyInfo = {} as ProxyInfo;
  //     proxyInfo.ipInfo = ip.generateClassD();
  //     await this.buildProxy(proxyInfo.ipInfo.ipaddress).then(async (data) => {
  //       if (data.length != 0) {
  //         proxyInfo.proxies = data;
  //         this.queue_.enqueue(proxyInfo);
  //         this.count_++;
  //         // console.log(`count updated ${this.count_}`);
  //       }
  //     });
  //     // console.log("scanning " + proxyInfo.ipInfo.ipaddress);
  //   }
  //   // console.log("class d scan done");
  // };

  /**
   * wrapper function for all proxy generation functions
   * @param processes
   */
  generateProxyWrapper = async (processes: number): Promise<void | boolean> => {
    for (let i = 0; i < processes; i++) {
      // this.generateProxyClassA();
      // this.generateProxyClassB();
      // this.generateProxyClassC();
    }
  };

  /**
   * calls all generatation functions
   * @param processes
   */
  scanForProxies = async (processes: number) => {
    return this.generateProxyWrapper(processes).then(async (data) => {
      return data;
    });
  };

  /**
   * prints queue
   */
  printQueue = () => {
    this.queue_.getStorage().forEach((e) => {
      console.log("ip info: " + e.ipInfo.ipaddress + " proxies: " + e.proxies);
    });
    console.log(`proxies scanned on ${this.dateCreated_}`);
  };

  /**
   *
   * @returns
   */
  getCurrentHost = () => {
    return this.currentHost_;
  };

  /**
   *
   * @returns
   */
  getCurrentPort = () => {
    return this.currentPort_;
  };
}
