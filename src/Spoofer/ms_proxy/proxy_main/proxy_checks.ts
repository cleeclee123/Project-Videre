import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";
import { uas } from "../types.js";

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
 * tests if proxies work by checking current ip address on httpbin
 * @param proxy
 * @returns
 */
export const testHTTPBin = async (
  host: string,
  port: string
): Promise<boolean | undefined> => {
  /** @todo: build custom implementation of http agent (tunneling), this will go thru proxy express server (configs will be handled in proxy server)*/
  let config = {
    headers: {
      "User-Agent": uas[Math.floor(Math.random() * uas.length)],
      "Accept-Language": "en-US",
      "Accept-Encoding": "gzip, deflate",
      Accept: "text/html",
      Referer: "http://www.google.com/",
    },
    agent: new HttpsProxyAgent.HttpsProxyAgent({
      host: host,
      port: Number(port),
    }),
  };
  // can use this also: "http://ip-api.com/json/?fields=8217"
  try {
    return await fetch(`https://httpbin.org/ip`, config).then(
      async (response) => {
        if (response.status === 400) {
          return false;
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          let data: any = await response.json();
          if (host === String(data["origin"])) {
            return true;
          } else {
            return getMyPublicIP().then((publicip) => {
              if (String(data["origin"]) !== publicip) {
                return true;
              }
            });
          }
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
export const testGoogle = async (
  host: string,
  port: string
): Promise<boolean | undefined> => {
  /** @todo: build custom implementation of http agent (tunneling), this will go thru proxy express server (configs will be handled in proxy server)*/
  let config = {
    headers: {
      "User-Agent": uas[Math.floor(Math.random() * uas.length)],
      "Accept-Language": "en-US",
      "Accept-Encoding": "gzip, deflate",
      Accept: "text/html",
      Referer: "http://www.google.com/",
      Connection: "close",
    },
    agent: new HttpsProxyAgent.HttpsProxyAgent({
      host: host,
      port: Number(port),
    }),
  };
  // can use this also: "http://ip-api.com/json/?fields=8217"
  try {
    return await fetch(`https://www.google.com/`, config).then(
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
