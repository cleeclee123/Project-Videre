/**
 * spoofer.ts
 * @version 1.0.0
 * @author Chris Lee <cl114@illinois.edu>
 *
 * most of code is from my "Spiteful Spoofer" project, refactored with TypeScript and additonal features
 * more information about what im trying to do here: https://en.wikipedia.org/wiki/Referer_spoofing
 * references (and the references listed): https://github.com/JoshuaProvoste/IP-Spoofing-Headers
 */

import axios from "axios";
import { load } from "cheerio";

/**
 * type Proxy
 * data members are from sslproxies.org tables
 */
type Proxy = {
  domain?: string;
  link?: string;
  ipAddresses: string;
  portNumbers: string;
  codes: string;
  countries: string;
  versions: string;
  googleStatus: string;
  anomymities: string;
  https: boolean;
  statusDuringScrape: string;
};
/**
 * scrapes random table of proxies from sslproxies.org
 * @todo: redesign - not to be random table
 *
 * @returns array of Proxy objects
 */
export const scrapeProxies = async () => {
  const ERROR_MESSAGE = "Error with Proxy Generator";
  const links = [
    "https://www.sslproxies.org/",
    "https://www.socks-proxy.net/",
    "https://free-proxy-list.net/",
    "https://www.us-proxy.org/",
    "https://free-proxy-list.net/uk-proxy.html",
    "https://free-proxy-list.net/anonymous-proxy.html",
  ];

  // not inclusive
  let linkIndex: number = Math.floor(Math.random() * 6);
  let proxies: Proxy[] = [];

  await axios
    .get(links[linkIndex])
    .then(async function (response) {
      // load html data with cheerio
      const $ = load(response.data);

      const keys: string[] = [];
      $("table.table-striped.table-bordered")
        .find("tr")
        .each((row, elem) => {
          if (row === 0) {
            $(elem)
              .find("th")
              .each((idx, elem) => {
                const key = $(elem).text().trim().toLowerCase();
                keys.push(key);
              });
          } else {
            let currentProxy = {} as Proxy;
            $(elem)
              .find("td,th")
              .each((idx, elem) => {
                const value = $(elem).text().trim().toLowerCase();
                const key = keys[idx];

                currentProxy.domain = links[linkIndex].substring(
                  links[linkIndex].indexOf("www.")
                );
                currentProxy.link = links[linkIndex];

                if (key === "ip address") {
                  currentProxy.ipAddresses = value;
                } else if (key === "port") {
                  currentProxy.portNumbers = value;
                } else if (key === "code") {
                  currentProxy.codes = value;
                } else if (key === "country") {
                  currentProxy.countries = value;
                } else if (key === "version") {
                  currentProxy.versions = value;
                } else if (key === "anonymity") {
                  currentProxy.anomymities = value;
                } else if (key === "google") {
                  currentProxy.googleStatus = value;
                } else if (key === "https") {
                  value === "yes"
                    ? (currentProxy.https = true)
                    : (currentProxy.https = false);
                } else if (key === "last checked") {
                  currentProxy.statusDuringScrape = value;
                }
              });
            proxies.push(currentProxy);
          }
        });
    })
    .catch(async function (error) {
      return `${ERROR_MESSAGE} ${error}`;
    });

  return proxies;
};



// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent/Firefox

enum Product {
  edgeWin = "edge_win",
  edgeMac = "edge_mac",
  chromeWin = "chrome_win",
  chromeMac = "chrome_mac",
  chromeLinux = "chrome_linux",
  chromeAndroid = "chrome_android",
  firefoxWin = "firefox_win",
  firefoxMac = "firefox_mac",
  firefoxLinux = "firefox_linux",
  firefoxAndroid = "firefox_android",
  operaWin = "opera_win",
  operaMac = "opera_mac",
  safariIphone = "safari_iphone",
  safariMac = "safari_mac",
}

type UserAgent = {
  userAgent: string;
  broswer: string;
};

const scrapeUserAgents = async () => {};

const callbackHelper = async () => {};

const buildHeader = async () => {};
