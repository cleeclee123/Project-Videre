import axios from "axios";
import { load } from "cheerio";
import { createWriteStream, WriteStream } from 'fs';
import { join } from 'path';

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
 * @returns a promise, array of Proxy objects
 */
export const scrapeProxies = async (link: string): Promise<Proxy[]> => {
  const ERROR_MESSAGE = "Error with Proxy Generator";
  let proxies: Proxy[] = [];

  await axios
    .get(link)
    .then(async (response) => {
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

                currentProxy.domain = link.substring(
                  link.indexOf("www.")
                );
                currentProxy.link = link;

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
    .catch(async (error) => {
      return `${ERROR_MESSAGE} ${error}`;
    });
  return proxies;
};

/**
 * scrapes random table of proxies from sslproxies.org and writes to file
 * @todo: write to database, looping too many times
 *
 * @return none
 */
 export const proxiesWriteFile = async (filename: string, link: string): Promise<void> => {
  // flags: w = Open file for reading and writing. File is created if not exists
  try {
    let writeStream: WriteStream = createWriteStream(join(__dirname, filename), {
      flags: 'w'
    });
    scrapeProxies(link).then(async (data: Proxy[]) => {
      data.forEach(async (element: Proxy) => {
        writeStream.write(element.ipAddresses + "\n");
      })     
    }).catch((pscbError) => {
      throw new Error("proxy scraper callback error " + String(pscbError));
    })
  } catch (awtfError) {
    throw new Error("async write to file error " + String(awtfError));
  }
}

