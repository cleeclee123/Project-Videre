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
}

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

                currentProxy.domain = links[linkIndex].substring(links[linkIndex].indexOf("www."));
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
                  value === "yes" ? currentProxy.https = true : currentProxy.https = false;
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

const scrapeUserAgents = async () => {};

const callbackHelper = async () => {};

const buildHeader = async () => {};
