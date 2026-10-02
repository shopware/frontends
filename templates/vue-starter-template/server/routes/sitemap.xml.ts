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
 * Sitemap index for the files Shopware generates for the sales channel. The
 * files are served by `/sitemap/[...path]`, so every location is on this host.
 */
export default defineEventHandler(async (event) => {
  const { origin } = getRequestURL(event, {
    xForwardedHost: true,
    xForwardedProto: true,
  });
  const files = await listSitemapFiles();

  const entries = files
    .map(
      ({ path }) =>
        `  <sitemap>\n    <loc>${escapeXml(`${origin}/sitemap/${path}`)}</loc>\n  </sitemap>`,
    )
    .join("\n");

  setHeader(event, "Content-Type", "application/xml");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;
});
