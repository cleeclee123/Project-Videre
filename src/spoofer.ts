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
import { resourceLimits } from "worker_threads";

interface IProxy {
  domain?: string;
  link?: string;
  ipAddresses: string[];
  portNumbers: string[];
  codes: string[];
  countries: string[];
  anomymity: string[];
  https: boolean[];
  statusDuringScrape: string[];
}

export const generateProxy = async () => {
  const ERROR_MESSAGE = "Error with Proxy Generator";
  const links = [
    "https://www.sslproxies.org/",
    "https://www.socks-proxy.net/",
    "https://free-proxy-list.net/",
    "https://www.us-proxy.org/",
    "https://free-proxy-list.net/uk-proxy.html",
    "https://free-proxy-list.net/anonymous-proxy.html",
  ];

  let linkIndex: number = Math.floor(Math.random() * 6);
  let proxy = {} as IProxy;
  proxy.domain = links[linkIndex].substring(links[linkIndex].indexOf("www."));
  proxy.link = links[linkIndex];

  await axios
    .get(links[linkIndex])
    .then(async function (response) {
      // load html data with cheerio
      const $ = load(response.data);

      const keys: string[] = [];
      const results: any = [];
      $("table.table-striped.table-bordered")
        .find("tr")
        .each((row, elem) => {
          if (row === 0) {
            $(elem)
              .find("th")
              .each((idx, elem) => {
                const key = $(elem).text().trim();
                keys.push(key);
              });
          } else {
            const nextProxy = new Map<string, string>();
            $(elem)
              .find("td,th")
              .each((idx, elem) => {
                const value = $(elem).text().trim();
                const key = keys[idx];

                console.log({"key": key, "value": value});
                
                nextProxy.set(key, value);
              });
            results.push(nextProxy);
          }
        });
    })
    .catch(async function (error) {
      return `${ERROR_MESSAGE} ${error}`;
    });
};

const rotateUserAgent = async () => {};

const callbackHelper = async () => {};

const buildHeader = async () => {};
