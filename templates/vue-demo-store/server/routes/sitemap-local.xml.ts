import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import sitemapObject from "../sitemap";
import getURL from "requrl";

export default defineEventHandler(async (event) => {
  const stream = new SitemapStream({ hostname: getURL(event.node.req) });
  event.node.res.setHeader("Content-Type", "application/xhtml+xml");

  return streamToPromise(Readable.from(sitemapObject).pipe(stream)).then(
    (data) => data.toString(),
  );
});
