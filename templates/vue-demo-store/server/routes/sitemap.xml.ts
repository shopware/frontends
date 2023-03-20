import { getSitemap } from "@shopware-pwa/api-client";
import { streamToPromise, SitemapIndexStream } from "sitemap";
import { Readable } from "stream";
import { SitemapResult } from "@shopware-pwa/types";
import getURL from "requrl";
import { createInstance } from "@shopware-pwa/api-client";
type Sitemap = {
  url: string;
};

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const apiContext = createInstance({
    endpoint: runtimeConfig.public.shopware.shopwareEndpoint,
    accessToken: runtimeConfig.public.shopware.shopwareAccessToken,
  });

  const sitemaps: Sitemap[] = [];
  const response = await getSitemap(apiContext);
  const smis = new SitemapIndexStream();

  response.forEach((element: SitemapResult) => {
    sitemaps.push({
      url: element.filename,
    });
  });

  sitemaps.push({
    url: `${getURL(event.node.req)}/sitemap-local.xml`,
  });

  event.node.res.setHeader("Content-Type", "application/xhtml+xml");

  return streamToPromise(Readable.from(sitemaps).pipe(smis)).then((data) =>
    data.toString()
  );
});
