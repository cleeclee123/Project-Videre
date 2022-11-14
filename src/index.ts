import { scrapeProxies } from "./Spoofer/spoofer";

scrapeProxies().then((data) => {
  console.log(data);
});