// Agents discover and call UCP on the storefront domain. fetch() always sends
// the target's own Host, so the storefront host travels as X-Forwarded-Host,
// which Shopware honors once this server is a trusted proxy
// (SYMFONY_TRUSTED_PROXIES, SYMFONY_TRUSTED_HEADERS; see the README).
const PAYLOAD_METHODS = new Set(["PATCH", "POST", "PUT", "DELETE"]);

// Shopware trusts what this server says about the hop, so nothing the client
// says about it may pass through. proxyRequest would forward all of these.
const HOP_HEADERS = /^(?:forwarded|x-forwarded-.*|x-real-ip)$/;

export default defineEventHandler(async (event) => {
  if (!isHandoffEnabled(event) || !isStorefrontHost(event)) {
    return;
  }

  const target = resolveUcpTarget(event);
  if (!target) {
    return;
  }

  const host = getForwardedHost(event);
  const protocol = getRequestProtocol(event, { xForwardedProto: true });
  // Trailing ":port" only, so "[::1]:3000" works and "[::1]" falls back.
  const port =
    /:(\d+)$/.exec(host)?.[1] ?? (protocol === "https" ? "443" : "80");

  const headers: Record<string, string> = {};
  for (const [name, value] of Object.entries(getProxyRequestHeaders(event))) {
    if (typeof value === "string" && !HOP_HEADERS.test(name)) {
      headers[name] = value;
    }
  }

  // Buffered, as proxyRequest does it. fetch() takes the bytes, not a Buffer.
  const body = PAYLOAD_METHODS.has(event.method)
    ? await readRawBody(event, false).catch(() => undefined)
    : undefined;

  return sendProxy(event, target.href, {
    fetchOptions: {
      method: event.method,
      body: body && new Uint8Array(body),
      headers: {
        ...headers,
        "x-forwarded-host": host,
        "x-forwarded-proto": protocol,
        "x-forwarded-port": port,
        // The peer, not whatever the client put in X-Forwarded-For.
        "x-forwarded-for": getRequestIP(event) ?? "",
        // getProxyRequestHeaders drops Accept, which MCP's Streamable HTTP
        // negotiates on.
        ...(getRequestHeader(event, "accept")
          ? { accept: getRequestHeader(event, "accept") as string }
          : {}),
      },
    },
  });
});
