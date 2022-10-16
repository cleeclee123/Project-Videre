import axios, { AxiosResponse, AxiosError, AxiosHeaders } from "axios";
import { load } from "cheerio";

// interface IUrl {
//   link: string;
// }

// type PageResponse = {
//   data: IUrl[];
// }

export const crawl = async (url: string) => {
  await axios.get(url).then(async (response) => {
    // load function from cheerio
    const $ = load(response.data);

    // grabbing all links that cheerio sees
    const links = $("a")
      .map((i, e) => e.attribs.href)
      .get();

    console.log(links);
  });
};

crawl("https://en.wikipedia.org/wiki/Orlando,_Florida");

/*
// TODO: 
  - Adjacency List vs Adjacency Matrix
  - Storage and Travsersal
  - Analysis
  - 
*/