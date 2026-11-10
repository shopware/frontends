// Agents discover and call UCP on the storefront domain. Shopware resolves the
// sales channel, and builds every URL it hands out (continue_url, order
// permalinks, endpoints in the profile), from the host it sees. fetch() always
// sends the target's own Host, so the storefront host travels as
// X-Forwarded-Host, which Shopware honors once this server is a trusted proxy
// (SYMFONY_TRUSTED_PROXIES, SYMFONY_TRUSTED_HEADERS; see the README).
export default defineEventHandler((event) => {
  const target = resolveUcpTarget(event);
  if (!target) {
    return;
  }

  const host = getStorefrontHost(event);
  const protocol = getRequestProtocol(event, { xForwardedProto: true });
  const port = host.split(":")[1] ?? (protocol === "https" ? "443" : "80");

  return proxyRequest(event, target.href, {
    headers: {
      "x-forwarded-host": host,
      "x-forwarded-proto": protocol,
      "x-forwarded-port": port,
    },
  });
});
