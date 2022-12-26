import * as net from "net";
import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";
import * as ip from "./ipaddress.js";
import { IPInfo } from "./ipaddress.js";
import { Queue } from "../lib/queue.js";

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

type ProtocolPort = {
  protocol: string;
  port: number;
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
  public testHTTPBin = async (host: string, port: string) => {
    let config = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0",
      },
      agent: new HttpsProxyAgent.HttpsProxyAgent({
        host: host,
        port: Number(port),
      }), // build custom implementation of http agent (tunneling), this will go thru proxy express server
    };
    try {
      return await fetch(`https://httpbin.org/ip`, config).then(
        async (response) => {
          if (response.status === 400) {
            return false;
          }
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            let data: any = await response.json();
            if (host === data["origin"]) {
              return true;
            }
            return false;
          }
          return false;
        }
      );
    } catch (error) {
      console.log(`httpbin error: ${error}`);
    }
  };

  /**
   * tests if proxies work by checking connection thru google
   * @param proxy
   * @returns
   */
  public testGoogle = (proxy: string) => {};

  /**
   * attempts to connect to socket with passed in ip address on passed in port
   * resolves promise to true right away if port is open, to false if port is closed
   * @param host, passed in ip address (string)
   * @param port, passed in port number (string but node net wants it a number)
   */
  public checkPort = (
    host: string,
    port: string,
    t: number
  ): Promise<boolean> => {
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
        console.log(`checkPort error: ${error}`);
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
  private buildProxyHelper = async (
    host: string,
    port: string
  ): Promise<ProxyParts> => {
    return this.checkPort(host, port, 1000).then((data) => {
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
            // if (await this.testGoogle(`https://${host}:${String(port)}`)) {
            //   current.googleTest = true;
            // }
            if (await this.testHTTPBin(host, port)) {
              current.httpbinTest = true;
            }
            resolve(current);
          } else {
            current.host = host;
            current.port = port;
            current.protocol = "http";
            current.proxyString = `http://${host}:${String(port)}`;
            current.httpbinTest = false;
            current.googleTest = false;
            // if (await this.testGoogle(`https://${host}:${String(port)}`)) {
            //   current.googleTest = true;
            // }
            if (await this.testHTTPBin(host, port)) {
              current.httpbinTest = true;
            }
            resolve(current);
          }
        } else {
          resolve(current);
        }
      });
    });
  };

  /**
   * loops thru http(s) ports and checks if able to connect, callback hell is inevitable
   * @param host
   * @returns Promise<Array<String>> array of proxies associated with the host
   */
  public buildProxy = async (
    host: string
  ): Promise<ProxyParts[] | undefined> => {
    const kHttpPorts: Array<ProtocolPort> = [
      { protocol: "http(s)", port: 80 },
      { protocol: "http(s)", port: 8080 },
      { protocol: "http(s)", port: 8008 },
      { protocol: "http(s)", port: 443 },
      { protocol: "http(s)", port: 3128 },
      { protocol: "http(s)", port: 8118 },
      { protocol: "http(s)", port: 8888 },
      { protocol: "http(s)", port: 8090 },
      { protocol: "http(s)", port: 8088 },
      { protocol: "http(s)", port: 3128 },
      { protocol: "http(s)", port: 8118 },
      { protocol: "http(s)", port: 8888 },
      { protocol: "http(s)", port: 8090 },
      { protocol: "http(s)", port: 9030 },
    ];
    // const kSocksPorts: Array<ProtocolPort> = [{"protocol": "socks", "port": 80}]
    try {
      let res = kHttpPorts.map(async (port) => {
        return await this.buildProxyHelper(host, String(port.port));
      });
      return Promise.all(res).then((promise) => {
        return Promise.all(promise).then((parts) => {
          return parts.filter((value) => Object.keys(value).length !== 0);
        });
      });
    } catch (error) {
      console.log(`buildProxy error ${error}`);
    }
  };

  /**
   * generation for class a proxies, buildProxy is this projects Jesus, no cb-hell for generation functions
   */
  private generateProxyClassA = async (): Promise<void> => {
    let proxyInfo = {} as ProxiesInfo;
    proxyInfo.ipInfo = ip.generateClassA();
    await this.buildProxy(proxyInfo.ipInfo.ipaddress).then((promiseParts) => {
      if (promiseParts !== undefined) {
        if (promiseParts.length != 0) {
          proxyInfo.proxies = promiseParts;
          this.queue_.enqueue(proxyInfo);
          this.count_++;
          console.log(promiseParts);
          console.log(`count updated ${this.count_}`);
        }
      } else {
        return;
      }
    });
    console.log(
      `scanning ${proxyInfo.ipInfo.ipaddress} current count ${this.count_} CLASS A`
    );
  };

  /**
   * generation for class b proxies
   */
  private generateProxyClassB = async (): Promise<void> => {
    let proxyInfo = {} as ProxiesInfo;
    proxyInfo.ipInfo = ip.generateClassB();
    await this.buildProxy(proxyInfo.ipInfo.ipaddress).then((promiseParts) => {
      if (promiseParts !== undefined) {
        if (promiseParts.length != 0) {
          proxyInfo.proxies = promiseParts;
          this.queue_.enqueue(proxyInfo);
          this.count_++;
          console.log(promiseParts);
          console.log(`count updated ${this.count_}`);
        }
      } else {
        return;
      }
    });
    console.log(
      `scanning ${proxyInfo.ipInfo.ipaddress} current count ${this.count_} CLASS B`
    );
  };

  /**
   * generation for class c proxies
   */
  private generateProxyClassC = async (): Promise<void> => {
    let proxyInfo = {} as ProxiesInfo;
    proxyInfo.ipInfo = ip.generateClassC();
    await this.buildProxy(proxyInfo.ipInfo.ipaddress).then((promiseParts) => {
      if (promiseParts !== undefined) {
        if (promiseParts.length != 0) {
          proxyInfo.proxies = promiseParts;
          this.queue_.enqueue(proxyInfo);
          this.count_++;
          console.log(promiseParts);
          console.log(`count updated ${this.count_}`);
        }
      } else {
        return;
      }
    });
    console.log(
      `scanning ${proxyInfo.ipInfo.ipaddress} current count ${this.count_} CLASS C`
    );
  };

  /**
   * generation for class d proxies, being no bueno
   */
  private generateProxyClassD = async (): Promise<void> => {
    let proxyInfo = {} as ProxiesInfo;
    proxyInfo.ipInfo = ip.generateClassD();
    await this.buildProxy(proxyInfo.ipInfo.ipaddress).then((promiseParts) => {
      if (promiseParts !== undefined) {
        if (promiseParts.length != 0) {
          proxyInfo.proxies = promiseParts;
          this.queue_.enqueue(proxyInfo);
          this.count_++;
          console.log(promiseParts);
          console.log(`count updated ${this.count_}`);
        }
      } else {
        return;
      }
    });
    console.log(
      `scanning ${proxyInfo.ipInfo.ipaddress} current count ${this.count_} CLASS D`
    );
  };

  /**
   * wrapper function for all proxy generation functions
   * @param processes
   */
  private generateProxyWrapper = async (processes: number): Promise<void> => {
    for (let i = 0; i < processes; i++) {
      this.generateProxyClassA();
      this.generateProxyClassB();
      this.generateProxyClassC();
    }
    // idk why i need to await this but it works
    await this.generateProxyClassA();
    //await this.generateProxyClassB();
    //await this.generateProxyClassC();
  };

  /**
   * calls all generatation functions
   * @param processes
   */
  public scanForProxies = async (processes: number) => {
    while (this.count_ < this.capacity_) {
      await this.generateProxyWrapper(processes);
    }
  };

  private printProxyParts = (parts: ProxyParts[]) => {
    parts.forEach((p) => {
      console.log(p);
    });
  };

  /**
   * prints queue
   */
  public printQueue = () => {
    this.queue_.getStorage().forEach((e) => {
      console.log(
        "ip info: " +
          e.ipInfo.ipaddress +
          " proxies: " +
          this.printProxyParts(e.proxies)
      );
    });
    console.log(`proxies scanned on ${this.dateCreated_}`);
  };

  /**
   *
   * @returns
   */
  public getCurrentHost = () => {
    return this.currentHost_;
  };

  /**
   *
   * @returns
   */
  public getCurrentPort = () => {
    return this.currentPort_;
  };
}
