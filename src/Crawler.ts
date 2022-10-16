import axios from "axios";
import { load } from "cheerio";

const seen: any = {};

export const getURL = (link: any) => {
  if (link.includes("http")) {
    return link;
  }
}

export const crawl = async ({url}: any) => {
  if (seen[url]) {
    return;
  }
  seen[url] = true;
  await axios.get(url).then(async (response) => {
    // load function from cheerio
    const $ = load(response.data);

    // grabbing all links that cheerio sees
    const links = $("a")
      .map((i, e) => e.attribs.href)
      .get().forEach((link) => {
        console.log(link);
      });
  });
};

crawl({url: "https://en.wikipedia.org/wiki/Orlando,_Florida"});
