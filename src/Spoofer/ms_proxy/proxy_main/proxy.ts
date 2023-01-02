import * as net from "net";
import * as ip from "./ipaddress.js";
import { Queue } from "../../lib/queue.js";
import { testHTTP, testGoogle } from "./proxy_checks.js";
import { ProxyParts, ProxiesInfo, kHttpPorts, uas } from "../types.js";

export class Proxy {
  private capacity_: number;
  private count_: number;
  private queue_: Queue<ProxiesInfo>;
  private dateCreated_: Date;

  constructor(capacity: number) {
    this.capacity_ = capacity;
    this.count_ = 0;
    this.queue_ = new Queue<ProxiesInfo>(capacity);
    this.dateCreated_ = new Date();
  }

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
        console.log(`checkPort error: ${error} port: ${port}`);
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
          current.host = host;
          current.port = port;
          current.protocol = "http";
          // (await this.testHttps(host, port)) ? current.https = true : current.https = false;
          ((await testHTTP(host, port))?.hidesIP)
            ? (current.httpTest = true)
            : (current.httpTest = false);
          (await testGoogle(host, port))
            ? (current.googleTest = true)
            : (current.googleTest = false);
        }
        resolve(current);
      });
    });
  };

  /**
   * loops thru http(s) ports and checks if able to connect, callback hell is inevitable
   * @param host
   * @returns Promise<Array<String>> array of proxies associated with the host, we check if undefined in generation functions
   */
  public buildProxy = async (
    host: string
  ): Promise<ProxyParts[] | undefined> => {
    try {
      let res = kHttpPorts.map(async (port) => {
        return await this.buildProxyHelper(host, String(port.port));
      });
      return Promise.all(res).then(async (promise) => {
        return Promise.all(promise).then((parts) => {
          return parts.filter((value) => Object.keys(value).length !== 0);
        });
      });
    } catch (error) {
      console.log(`buildProxy error ${error}`);
    }
  };

  /**
   * check every port possible 1 to 65535, brute force approch to check for all open ports, not recommnended
   * @param host
   * @returns Promise<Array<String>> array of proxies associated with the host, we check if undefined in generation functions
   */
  public buildProxyAll = async (
    host: string
  ): Promise<ProxyParts[] | undefined> => {
    const kPortRange = 65536;
    // max - min + 1
    const portArr = Array.from(new Array(8080 - 1 + 1).keys()).map((num) => {
      return num + 1;
    });
    try {
      let res = [80, 8080].map(async (port) => {
        console.log(port);
        return await this.buildProxyHelper(host, String(port));
      });
      return await Promise.all(res).then(async (promise) => {
        return await Promise.all(promise).then((parts) => {
          return parts.filter((value) => Object.keys(value).length !== 0);
        });
      });
    } catch (error) {
      console.log(`buildProxyAll error ${error}`);
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
        if (promiseParts.length !== 0) {
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
  // private generateProxyClassD = async (): Promise<void> => {
  //   let proxyInfo = {} as ProxiesInfo;
  //   proxyInfo.ipInfo = ip.generateClassD();
  //   await this.buildProxy(proxyInfo.ipInfo.ipaddress).then((promiseParts) => {
  //     if (promiseParts !== undefined) {
  //       if (promiseParts.length != 0) {
  //         proxyInfo.proxies = promiseParts;
  //         this.queue_.enqueue(proxyInfo);
  //         this.count_++;
  //         console.log(promiseParts);
  //         console.log(`count updated ${this.count_}`);
  //       }
  //     } else {
  //       return;
  //     }
  //   });
  //   console.log(
  //     `scanning ${proxyInfo.ipInfo.ipaddress} current count ${this.count_} CLASS D`
  //   );
  // };

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

  /**
   * prints queue
   */
  public printQueue = () => {
    const printProxyParts = (parts: ProxyParts[]) => {
      parts.forEach((p) => {
        console.log(p);
      });
    };
    this.queue_.getStorage().forEach((e) => {
      console.log(
        "ip info: " +
          e.ipInfo.ipaddress +
          " proxies: " +
          printProxyParts(e.proxies)
      );
    });
    console.log(`proxies scanned on ${this.dateCreated_}`);
  };
}
