import axios from "axios";
import { load } from "cheerio";

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent/Firefox
// https://github.com/tarampampam/random-user-agent/blob/master/src/useragent/generator.ts

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