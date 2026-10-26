/**
 * Serves one of Shopware's sitemap files from this host. Only files the Store
 * API lists are proxied, so this is not an open proxy.
 */
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path") ?? "";
  // The router hands over a decoded path; listed paths keep URL encoding.
  const file = (await listSitemapFiles()).find(
    (entry) => decodeURI(entry.path) === path,
  );

  if (!file) {
    throw createError({ statusCode: 404, statusMessage: "Sitemap not found" });
  }

  const upstream = await fetchSitemapFile(file);
  if (upstream.status !== 200) {
    throw createError({
      statusCode: 502,
      statusMessage: "Sitemap file unavailable",
    });
  }

  setHeader(event, "Content-Type", "application/gzip");

  return Buffer.from(await upstream.arrayBuffer());
});
