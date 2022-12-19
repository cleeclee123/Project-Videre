import * as s_proxy from "./Spoofer/ms_proxy/scrape_proxy.js";
import * as ip from "./Spoofer/ms_proxy/ipaddress.js";
import * as ping from "./Spoofer/lib/ping.js";
import * as proxy from "./Spoofer/ms_proxy/proxy.js";
import { performance } from "perf_hooks";

// proxy.rotateProxies(1).then(async (data) => {
//   console.log(data);
// });

// proxy.writeFileProxies("../../data/sslproxies.txt", "https://www.sslproxies.org/");
// proxy.writeFileProxies("../../data/usproxies.txt", "https://www.us-proxy.org/");

// console.log(ip.generateClassA());

// console.log(ping.pingChuck("google.com"))

// const startTm = Date.now();
// ping
//   .checkResponse("google.com")
//   .then(async (data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.log(error);
//   })
//   .then((data) => {
//     const runTm = Date.now() - startTm;
//     console.log(`Duration was: ${runTm}ms`);
//   })

// console.log(ip.generateClassA());

let max = 1;
let count = 0;
while (count < max) {
  let ipad = ip.generateClassA().ipaddress;
  await proxy.buildProxy(ipad).then(async (data) => {
    if (data.length != 0) {
      console.log("FOUND " + ipad + " " + data);
      count++;
    }
  });
  console.log("scanning " + ipad);
}
