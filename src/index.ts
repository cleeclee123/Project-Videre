import * as proxy from "./Spoofer/proxy";

proxy.rotateProxies(1).then(async (data) => {
  console.log(data);
});

// proxy.writeFileProxies("../../data/sslproxies.txt", "https://www.sslproxies.org/");
// proxy.writeFileProxies("../../data/usproxies.txt", "https://www.us-proxy.org/");
