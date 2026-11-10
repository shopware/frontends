import type { H3Event } from "h3";

// Off by default. A scaffold should neither proxy nor announce UCP until the
// shop runs the plugin (NUXT_PUBLIC_AGENTIC_HANDOFF_ENABLED=true).
export function isHandoffEnabled(event?: H3Event): boolean {
  return useRuntimeConfig(event).public.agenticHandoff.enabled === true;
}

// Served by the agentic-commerce plugin: the UCP profile, the A2A agent card,
// and every UCP transport (REST, MCP, A2A, embedded, OAuth) under /ucp/.
const UCP_PATHS = new Set(["/.well-known/ucp", "/.well-known/agent-card.json"]);
const UCP_PATH_PREFIX = "/ucp/";

function isUcpPath(pathname: string): boolean {
  return UCP_PATHS.has(pathname) || pathname.startsWith(UCP_PATH_PREFIX);
}

// The path is checked after normalization, not as it arrives: "/ucp/%2e%2e/x"
// starts with "/ucp/" but resolves to "/x", and "//host/x" resolves to another
// origin. Returns the normalized path with its query, or null for anything
// that is not a UCP path on this server.
export function resolveUcpPath(path: string): string | null {
  let normalized: URL;
  try {
    normalized = new URL(path, "http://request.invalid/");
  } catch {
    return null;
  }

  if (normalized.origin !== "http://request.invalid") {
    return null;
  }

  return isUcpPath(normalized.pathname)
    ? `${normalized.pathname}${normalized.search}`
    : null;
}

// The UCP path of this request, mounted under the Shopware origin. The origin
// may carry a path ("https://host/shop"), which is kept.
export function resolveUcpTarget(event: H3Event): URL | null {
  const path = resolveUcpPath(event.path);
  if (!path) {
    return null;
  }

  try {
    return new URL(`${getShopwareOrigin(event)}${path}`);
  } catch {
    return null;
  }
}

export function getRequestedHost(event: H3Event): string {
  return getRequestHost(event, { xForwardedHost: true }).toLowerCase();
}

export function getRequestedOrigin(event: H3Event): string {
  const protocol = getRequestProtocol(event, { xForwardedProto: true });

  return `${protocol}://${getRequestedHost(event)}`;
}

// Only the continue page on this origin may adopt a token: another site cannot
// post on the buyer's behalf, and an agent cannot skip the page. Browsers
// without Sec-Fetch-Site still send Origin on a form post. A page served with
// no-referrer would send "null", which is refused like any foreign origin.
export function isSameOriginPost(
  headers: Record<string, string | undefined>,
  requestedOrigin: string,
): boolean {
  const site = headers["sec-fetch-site"];

  return site ? site === "same-origin" : headers.origin === requestedOrigin;
}

// Shopware resolves the sales channel, and builds continue_url, the profile
// endpoints and the order permalink, from the host this proxy forwards. The
// host is taken from the request, so a spoofed X-Forwarded-Host could move
// those URLs to another domain. The configured list limits it to the shop's
// own hosts; an empty list trusts the request, which previews need.
export function isAllowedHost(host: string, storefrontHosts: string): boolean {
  const hosts = storefrontHosts
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return !hosts.length || hosts.includes(host.toLowerCase());
}

export function isStorefrontHost(event: H3Event): boolean {
  return isAllowedHost(
    getRequestedHost(event),
    useRuntimeConfig(event).agenticHandoff.storefrontHosts,
  );
}

export function getShopwareOrigin(event: H3Event): string {
  const origin =
    useRuntimeConfig(event).agenticHandoff.shopwareOrigin ||
    getShopwareServerConfig().endpoint.replace(/\/store-api\/?$/, "");

  return origin.replace(/\/+$/, "");
}
