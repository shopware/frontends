import { streamToPromise, SitemapIndexStream } from "sitemap";
import { Readable } from "stream";
import apiClient from "../apiBuilder";
import getURL from "requrl";

type Sitemap = {
  url: string;
};

export default defineEventHandler(async (event) => {
  const sitemaps: Sitemap[] = [];
  const response = await apiClient.invoke("readSitemap get /sitemap");
  const smis = new SitemapIndexStream();

  response.forEach((element) => {
    sitemaps.push({
      url: element.filename,
    });
  });

  sitemaps.push({
    url: `${getURL(event.node.req)}/sitemap-local.xml`,
  });

  event.node.res.setHeader("Content-Type", "application/xhtml+xml");

  return streamToPromise(Readable.from(sitemaps).pipe(smis)).then((data) =>
    data.toString(),
  );
});
