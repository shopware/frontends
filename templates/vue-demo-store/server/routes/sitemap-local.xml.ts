import { Readable } from "node:stream";

import { isTechnicalUrl } from "@shopware/helpers";
import getURL from "requrl";
import { SitemapStream, streamToPromise } from "sitemap";

import sitemapObject from "../sitemap";

export default defineEventHandler(async (event) => {
  const hostname = getURL(event.node.req);
  const technicalUrls = sitemapObject.filter(({ url }) =>
    isTechnicalUrl(url, hostname),
  );
  const sitemapEntries = sitemapObject.filter(
    ({ url }) => !isTechnicalUrl(url, hostname),
  );

  if (technicalUrls.length) {
    console.warn(
      "[sitemap-local.xml] Skipping technical Shopware URLs:",
      technicalUrls.map(({ url }) => url),
    );
  }

  const stream = new SitemapStream({ hostname });
  event.node.res.setHeader("Content-Type", "application/xhtml+xml");

  return streamToPromise(Readable.from(sitemapEntries).pipe(stream)).then(
    (data) => data.toString(),
  );
});
