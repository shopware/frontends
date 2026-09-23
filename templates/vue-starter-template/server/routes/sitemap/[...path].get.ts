/**
 * Serves one of Shopware's sitemap files from this host. Only files the Store
 * API lists are proxied, so this is not an open proxy.
 */
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path") ?? "";
  const file = (await listSitemapFiles()).find((entry) => entry.path === path);

  if (!file) {
    throw createError({ statusCode: 404, statusMessage: "Sitemap not found" });
  }

  const upstream = await fetchSitemapFile(file);
  if (!upstream.ok) {
    throw createError({
      statusCode: 502,
      statusMessage: "Sitemap file unavailable",
    });
  }

  setHeader(
    event,
    "Content-Type",
    path.endsWith(".gz") ? "application/gzip" : "application/xml",
  );

  return Buffer.from(await upstream.arrayBuffer());
});
