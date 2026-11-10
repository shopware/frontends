// Agents discover and call UCP on the storefront domain. fetch() always sends
// the target's own Host, so the storefront host travels as X-Forwarded-Host,
// which Shopware honors once this server is a trusted proxy
// (SYMFONY_TRUSTED_PROXIES, SYMFONY_TRUSTED_HEADERS; see the README).
export default defineEventHandler((event) => {
  if (!isHandoffEnabled(event) || !isStorefrontHost(event)) {
    return;
  }

  const target = resolveUcpTarget(event);
  if (!target) {
    return;
  }

  const host = getRequestedHost(event);
  const protocol = getRequestProtocol(event, { xForwardedProto: true });
  // Trailing ":port" only, so "[::1]:3000" works and "[::1]" falls back.
  const port =
    /:(\d+)$/.exec(host)?.[1] ?? (protocol === "https" ? "443" : "80");

  return proxyRequest(event, target.href, {
    headers: {
      "x-forwarded-host": host,
      "x-forwarded-proto": protocol,
      "x-forwarded-port": port,
      // proxyRequest passes the client's own X-Forwarded-For through, and
      // Shopware trusts it from this server. Report the peer instead.
      "x-forwarded-for": getRequestIP(event) ?? "",
      // proxyRequest drops Accept, which MCP's Streamable HTTP negotiates on.
      ...(getRequestHeader(event, "accept")
        ? { accept: getRequestHeader(event, "accept") as string }
        : {}),
    },
  });
});
