import * as s_proxy from "./Spoofer/ms_proxy/scrape_proxy.js";
import * as ip from "./Spoofer/ms_proxy/proxy_main/ipaddress.js";
import * as ping from "./Spoofer/lib/ping.js";
import * as proxy from "./Spoofer/ms_proxy/proxy_main/proxy.js";
import * as server from "./Spoofer/ms_proxy/proxy_main/proxy_server.js";
import * as check from "./Spoofer/ms_proxy/proxy_main/proxy_checks.js";

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

// let s = new server.Server(443);
// s.start();

// let s: server.Server = new server.Server(3001);
// s.start();

let p = new proxy.Proxy(5);
// p.testHTTPBin("http://20.206.106.192:80").then((data) => {
//   console.log(data);
// })

// p.checkPort("20.206.106.192", "80", 1000).then((data) => {
//   console.log(data);
// })

// await p.buildProxyHelper("20.206.106.192", "6969").then(async (data) => {
//   console.log(data);
// });

// 45.66.230.79
// await p.buildProxy("195.178.197.20").then(async (data) => {
//   console.log(data);
// });

// await p.buildProxy("20.210.26.214").then(async (data) => {
//   console.log(data);
// });

// await p.testHTTPBin("20.210.26.214", "3128").then((data) => {
//   console.log(data);
// })

// await p.scanForProxies(3).then((data) => {
//   console.log(data);
// });
// p.printQueue();

// await p.testGoogle("18.231.196.99", "3629").then((data) => {
//   console.log(data)
// });

await check.testAnonymity("210.245.124.131", "5239").then((data) => {
  console.log(data)
})
