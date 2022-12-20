import * as net from "net";
import * as ip from "./ipaddress.js";
import { IPInfo } from "./ipaddress.js";
import { Queue } from "../lib/queue.js";

type ProxyInfo = {
  ipInfo: IPInfo;
  proxies: Array<String>;
};

export class Proxy {
  private capacity_: number;
  private queue_: Queue<ProxyInfo>;
  private dateCreated_: Date;

  constructor(capacity: number) {
    this.capacity_ = capacity;
    this.dateCreated_ = new Date();
    this.queue_ = new Queue<ProxyInfo>(capacity);
  }

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
  buildProxyHelper = async (host: string, port: string): Promise<String> => {
    return await this.checkPort(host, port, 1000).then((data) => {
      if (data) {
        if (port === String(443)) {
          return `https://${host}:${String(port)}`;
        } else {
          return `http://${host}:${String(port)}`;
        }
      }
      return "";
    });
  };

  /**
   * loops thru http(s) ports and checks if able to connect,
   * @param host
   * @returns Promise<Array<String>> array of proxies associated with the host
   */
  buildProxy = async (host: string): Promise<Array<String>> => {
    const kHttpPorts: Array<number> = [80, 8080, 8008, 443];
    let resPromise = await Promise.all(
      kHttpPorts.map((port) => {
        return this.buildProxyHelper(host, String(port));
      })
    );
    return resPromise.filter((e) => e !== "");
  };

  /**
   * temp function Class A
   */
  generateProxyClassA = async (): Promise<void> => {
    let count = 0;
    if (this.queue_.getCapacity() < this.queue_.size()) {
      return;
    }
    while (count < this.capacity_) {
      let proxyInfo = {} as ProxyInfo;
      proxyInfo.ipInfo = ip.generateClassA();
      await this.buildProxy(proxyInfo.ipInfo.ipaddress).then(async (data) => {
        if (data.length != 0) {
          proxyInfo.proxies = data;
          this.queue_.enqueue(proxyInfo);
          this.printQueue();
          count++;
        }
      });
      console.log("scanning " + proxyInfo.ipInfo.ipaddress);
    }
    console.log("class a scan done");
  };
  /**
   * temp function Class B
   */
  generateProxyClassB = async (): Promise<void> => {
    let count = 0;
    if (this.queue_.getCapacity() < this.queue_.size()) {
      return;
    }
    while (count < this.capacity_) {
      let proxyInfo = {} as ProxyInfo;
      proxyInfo.ipInfo = ip.generateClassB();
      await this.buildProxy(proxyInfo.ipInfo.ipaddress).then(async (data) => {
        if (data.length != 0) {
          proxyInfo.proxies = data;
          this.queue_.enqueue(proxyInfo);
          this.printQueue();
          count++;
        }
      });
      console.log("scanning " + proxyInfo.ipInfo.ipaddress);
    }
    console.log("class b scan done");
  };
  /**
   * temp function
   */
  generateProxyClassC = async (): Promise<void> => {
    let count = 0;
    if (this.queue_.getCapacity() < this.queue_.size()) {
      return;
    }
    while (count < this.capacity_) {
      let proxyInfo = {} as ProxyInfo;
      proxyInfo.ipInfo = ip.generateClassC();
      await this.buildProxy(proxyInfo.ipInfo.ipaddress).then(async (data) => {
        if (data.length != 0) {
          proxyInfo.proxies = data;
          this.queue_.enqueue(proxyInfo);
          this.printQueue();
          count++;
        }
      });
      console.log("scanning " + proxyInfo.ipInfo.ipaddress);
    }
    console.log("class c scan done");
  };

  /**
   * temp function Class
   */
  generateProxyClassD = async (): Promise<void> => {
    let count = 0;
    if (this.queue_.getCapacity() < this.queue_.size()) {
      return;
    }
    while (count < this.capacity_) {
      let proxyInfo = {} as ProxyInfo;
      proxyInfo.ipInfo = ip.generateClassD();
      await this.buildProxy(proxyInfo.ipInfo.ipaddress).then(async (data) => {
        if (data.length != 0) {
          proxyInfo.proxies = data;
          this.queue_.enqueue(proxyInfo);
          this.printQueue();
          count++;
        }
      });
      console.log("scanning " + proxyInfo.ipInfo.ipaddress);
    }
    console.log("class d scan done");
  };

  /**
   * calls all generatation functions
   * @param processes
   */
  scanForProxies = async (processes: number) => {
    this.generateProxyClassA();
    this.generateProxyClassA();
    // this.generateProxyClassB();
    // this.generateProxyClassC();
    //  for (let i = 0; i < processes; i++) {
    //     this.generateProxyClassA();
    //     this.generateProxyClassA();
    //     this.generateProxyClassB();
    //     this.generateProxyClassC();
    //   }
  };

  /**
   * prints queue
   */
  printQueue = () => {
    this.queue_.getStorage().forEach((e) => {
      console.log("ip info: " + e.ipInfo.ipaddress + " proxies: " + e.proxies);
    });
  };
}
