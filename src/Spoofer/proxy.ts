import axios from "axios";
import { load } from "cheerio";
import { createWriteStream, WriteStream } from "fs";
import { join } from "path";

/**
 * Validates passes in ipaddress
 * source: https://stackoverflow.com/questions/4460586/javascript-regular-expression-to-check-for-ip-addresses
 */
const validateIPaddress = (ipaddress: string) => {
  const validIPAddressRegEx =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (validIPAddressRegEx.test(ipaddress)) {
    return true;
  }
  return false;
};

/**
 * formats Proxy object to string, to be passed in http header
 * @return String
 */
export const formatProxy = (proxyObject: Proxy): string => {
  return `http://${proxyObject.ipAddresses}:${proxyObject.portNumbers}`;
};

/**
 * type Proxy
 * data members are from sslproxies.org tables
 */
type Proxy = {
  domain?: string;
  link?: string;
  ipAddresses?: string;
  portNumbers?: string;
  codes?: string;
  countries?: string;
  versions?: string;
  googleStatus?: string;
  anomymities?: string;
  https?: boolean;
  statusDuringScrape?: string;
  dateScraped?: Date;
  weight?: number;
};

/**
 * scrapes random table of proxies from sslproxies.org
 * @todo: redesign - not to be random table
 *
 * @returns a promise, array of Proxy objects
 */
export const scrapeProxies = async (link: string): Promise<Proxy[]> => {
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

                currentProxy.domain = link.substring(link.indexOf("www."));
                currentProxy.link = link;
                currentProxy.dateScraped = new Date();

                const InvalidIP = {};
                if (key === "ip address") {
                  try {
                    if (!validateIPaddress(value)) {
                      currentProxy.ipAddresses = "Invalid";
                      throw InvalidIP;
                    }
                    currentProxy.ipAddresses = value;
                  } catch (error) {
                    if (error != InvalidIP) {
                      throw new Error(`${error}`);
                    }
                  }
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
      throw new Error(`Error with Proxy Scraper" ${error}`);
    });
  return proxies;
};

/**
 * rotates/picks random proxy from above function
 * @params state = 0 => proxy object, state = 1 => formatted proxy to be passed in http header
 * @todo:
 *       - implement weighted rotator - reward/penalty system
 *       - implement subnet rotator
 *       - reference: https://scrapfly.io/blog/how-to-rotate-proxies-in-web-scraping/
 * @return Proxy Object
 */
export const rotateProxies = async (state: number): Promise<string | Proxy> => {
  if (state < 0 || state > 1) {
    throw new Error("state error");
  }
  const kLinks: string[] = [
    "https://www.sslproxies.org/",
    "https://www.socks-proxy.net/",
    "https://free-proxy-list.net/",
    "https://www.us-proxy.org/",
    "https://free-proxy-list.net/uk-proxy.html",
    "https://free-proxy-list.net/anonymous-proxy.html",
  ];
  // inclusive
  let linkIndex: number = Math.floor(Math.random() * 6);
  return scrapeProxies(kLinks[linkIndex])
    .then(async (data) => {
      // inclusive
      let proxyIndex: number = Math.floor(Math.random() * data.length);
      return state === 0 ? data[proxyIndex] : formatProxy(data[proxyIndex]);
    })
    .catch((error) => {
      throw new Error(`Error with Proxy Rotator" ${error}`);
    });
};

/**
 * gets the subnet of the ip adress from passed in proxy object
 * @params proxy Proxy object
 * @return type number, subnet of ip address
 */
export const getSubnet = (proxy: Proxy): string => {
  let indexOne: number | undefined = proxy.ipAddresses?.indexOf(".");
  if (typeof indexOne === undefined || typeof proxy.ipAddresses === undefined) {
    throw new Error("index error");
  }
  let indexTwo: number | undefined = proxy.ipAddresses?.indexOf(
    ".",
    Number(indexOne) + 1
  );
  return String(proxy.ipAddresses).substring(Number(indexOne), indexTwo);
};

/**
 * ensures that two ip addresses with the same subnet doesnt get picked twice in a row
 * @todo this function
 */
export const handleDiffSubnet = () => {};

/**
 * scrapes random table of proxies from sslproxies.org and writes to file
 * @todo: write to database, looping too many times
 *
 * @return none
 */
export const writeFileProxies = async (
  filename: string,
  link: string
): Promise<void> => {
  // flags: w = Open file for reading and writing. File is created if not exists
  try {
    let writeStream: WriteStream = createWriteStream(
      join(__dirname, filename),
      {
        flags: "w",
      }
    );
    scrapeProxies(link)
      .then(async (data: Proxy[]) => {
        data.forEach(async (element: Proxy) => {
          writeStream.write(
            `${element.ipAddresses}, ${element.dateScraped} "\n"`
          );
        });
      })
      .catch((pscbError) => {
        throw new Error("proxy scraper callback error " + String(pscbError));
      });
  } catch (awtfError) {
    throw new Error("async write to file error " + String(awtfError));
  }
};