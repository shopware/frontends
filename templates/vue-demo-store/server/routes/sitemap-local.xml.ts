import { Readable } from "node:stream";
import getURL from "requrl";
import { SitemapStream, streamToPromise } from "sitemap";
import sitemapObject from "../sitemap";

export default defineEventHandler(async (event) => {
  const stream = new SitemapStream({ hostname: getURL(event.node.req) });
  event.node.res.setHeader("Content-Type", "application/xhtml+xml");

  return streamToPromise(Readable.from(sitemapObject).pipe(stream)).then(
    (data) => data.toString(),
  );
});
