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
import { next } from "cheerio/lib/api/traversing";

interface IProxy {
  domain?: string;
  link?: string;
  ipAddresses: string[];
  portNumbers: string[];
  codes: string[];
  countries: string[];
  versions: string[];
  googleStatus: string[];
  anomymities: string[];
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

  // not inclusive
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
            let ipAddresses: string[] = [];
            let portNumbers: string[] = [];
            let codes: string[] = [];
            let countries: string[] = [];
            let versions: string[] = [];
            let google: string[] = [];
            let anomymities: string[] = [];
            let https: boolean[] = [];
            let statusDuringScrape: string[] = [];
            $(elem)
              .find("td,th")
              .each((idx, elem) => {
                const value = $(elem).text().trim().toLowerCase();
                const key = keys[idx];

                if (key === "ip address") {
                  ipAddresses.push(value);
                } else if (key === "port") {
                  portNumbers.push(value);
                } else if (key === "code") {
                  codes.push(value);
                } else if (key === "country") {
                  countries.push(value);
                } else if (key === "version") {
                  versions.push(value);
                } else if (key === "anonymity") {
                  anomymities.push(value);
                } else if (key === "google") {
                  google.push(value);
                } else if (key === "https") {
                  if (value === "yes") {
                    https.push(true);
                  } else {
                    https.push(false);
                  }
                } else if (key === "last checked") {
                  statusDuringScrape.push(value);
                }
              });
              proxy.ipAddresses = ipAddresses;
              proxy.portNumbers = portNumbers;
              proxy.codes = codes;
              proxy.countries = countries;
              proxy.versions = versions;
              proxy.googleStatus = google;
              proxy.anomymities = anomymities;
              proxy.https = https;
              proxy.statusDuringScrape = statusDuringScrape;

              console.log(proxy);
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
