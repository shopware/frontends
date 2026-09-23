import { createAPIClient } from "@shopware/api-client";

import type { operations } from "#shopware";

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (char) => XML_ESCAPES[char] ?? char);
}

/**
 * Sitemap index pointing at the sitemap files Shopware generates for the
 * sales channel. Shopware crawls its own SEO URLs, so nothing is listed here
 * by hand.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiClient = createAPIClient<operations>({
    accessToken: config.public.shopware.accessToken,
    baseURL: config.public.shopware.endpoint,
  });

  const { data: sitemaps } = await apiClient.invoke("readSitemap get /sitemap");

  const entries = sitemaps
    .map(
      ({ filename }) =>
        `  <sitemap>\n    <loc>${escapeXml(filename)}</loc>\n  </sitemap>`,
    )
    .join("\n");

  setHeader(event, "Content-Type", "application/xml");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;
});
