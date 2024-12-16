import { Readable } from "node:stream";
import getURL from "requrl";
import { SitemapIndexStream, streamToPromise } from "sitemap";
import apiClient from "../apiBuilder";

type Sitemap = {
  url: string;
};

export default defineEventHandler(async (event) => {
  const sitemaps: Sitemap[] = [];
  const response = await apiClient.invoke("readSitemap get /sitemap");
  const smis = new SitemapIndexStream();

  for (const element of response.data) {
    sitemaps.push({
      url: element.filename,
    });
  }

  sitemaps.push({
    url: `${getURL(event.node.req)}/sitemap-local.xml`,
  });

  event.node.res.setHeader("Content-Type", "application/xhtml+xml");

  return streamToPromise(Readable.from(sitemaps).pipe(smis)).then((data) =>
    data.toString(),
  );
});
