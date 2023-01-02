import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";
import { ProxyStatus, uas, fetchConfig } from "../types.js";

export const getMyPublicIP = async (): Promise<any | string> => {
  try {
    return await fetch(`https://httpbin.org/ip`).then(async (res) => {
      let data: any = await res.json();
      return data["origin"];
    });
  } catch (error) {
    console.log(`public ip getter error ${error}`);
  }
  return "";
};

/**
 * tests if proxies work (hides your actual public ip adress transparent v. anonymous) by checking current ip address on ip-api
 * @param proxy: host, port
 * @returns if proxy works
 */
export const testHTTP = async (
  host: string,
  port: string
): Promise<ProxyStatus | undefined> => {
  /** @todo: build custom implementation of http agent (tunneling), this will go thru proxy express server (configs will be handled in proxy server)*/
  try {
    let status = {} as ProxyStatus;
    return await fetch(`http://ip-api.com/json/`, fetchConfig(host, port)).then(
      async (response) => {
        if (response.status === 400) {
          console.log("400 response");
          status.status = false;
          return status;
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") === -1) {
          console.log("response is not json");
          status.status = false;
          return status;
        }
        const isAnonymousCallBack = async (): Promise<boolean> => {
          return getMyPublicIP().then((publicip) => {
            if (String(data["query"]) !== publicip) {
              return true;
            }
            return false;
          });
        };
        let data: any = await response.json();
        if (host === String(data["query"]) || (await isAnonymousCallBack())) {
          status.hidesIP = true;
          status.anonymity = "anonymous";
          status.status = true;
          status.country = String(data["country"]);
          status.region = String(data["regionName"]);
          status.city = String(data["city"]);
          status.zip = String(data["zip"]);
          status.location = {
            lat: String(data["lat"]),
            long: String(data["lon"]),
          };
          status.tz = String(data["timezone"]);
          status.isp = String(data["isp"]);
          return status;
        }
        console.log(`http error in response block`);
        status.status = false;
        return status;
      }
    );
  } catch (error) {
    console.log(`http error: ${error}`);
  }
};

/**
 * tests if proxies work by checking connection through google
 * @param proxy: host, port
 * @returns if proxy works
 */
export const testGoogle = async (
  host: string,
  port: string
): Promise<boolean | undefined> => {
  try {
    return await fetch(`https://www.google.com/`, fetchConfig(host, port)).then(
      async (response) => {
        if (response.status === 200) {
          return true;
        }
        return false;
      }
    );
  } catch (error) {
    console.log(`google error: ${error}`);
  }
};

/**
 * further proxy checks to see if elite proxy
 * approach: run own http server to see the headers server receives with proxy
 * reference: https://stackoverflow.com/questions/30293385/how-to-check-proxy-headers-to-check-anonymity
 * @param proxy: host, port
 * @returns number 0 (proxy is anonymous not elite) or 1 (proxy is elite)
 */
export const testAnonymity = async (
  host: string,
  port: string
) /* : number */ => {
  let config = {
    headers: {
      "User-Agent": uas[Math.floor(Math.random() * uas.length)],
      "Accept-Language": "en-US",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
      Accept: "text/html",
      Referer: "http://www.google.com/",
    },
    agent: new HttpsProxyAgent.HttpsProxyAgent({
      host: host,
      port: Number(port),
    }),
  };
  try {
    fetch("http://ip-api.com/json/?fields=8217", config).then(
      async (response) => {
        let json = await response.json();
        console.log(json);
      }
    );
  } catch (error) {
    console.log(`testAnonymity error: ${error}`);
  }
};
