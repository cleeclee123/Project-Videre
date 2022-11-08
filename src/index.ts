import { scrapeProxies } from "./spoofer";

scrapeProxies().then((data) => {
  console.log(data);
});