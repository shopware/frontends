import type { H3Event } from "h3";

// Served by the agentic-commerce plugin: the UCP profile, the A2A agent card,
// and every UCP transport (REST, MCP, A2A, embedded, OAuth) under /ucp/.
const UCP_PATHS = new Set(["/.well-known/ucp", "/.well-known/agent-card.json"]);
const UCP_PATH_PREFIX = "/ucp/";

// A UCP checkout id is the Shopware context token of the agent's cart:
// 32 hex characters from the plugin, 32 alphanumerics once Shopware rotates it.
export const CONTEXT_TOKEN_PATTERN = /^[A-Za-z0-9]{32}$/;

// Off by default. A scaffold should neither proxy nor announce UCP until the
// shop runs the plugin (NUXT_PUBLIC_AGENTIC_HANDOFF_ENABLED=true).
export function isHandoffEnabled(event?: H3Event): boolean {
  return useRuntimeConfig(event).public.agenticHandoff.enabled === true;
}

export function isUcpPath(path: string): boolean {
  const pathname = path.split("?", 1)[0] ?? "";

  return UCP_PATHS.has(pathname) || pathname.startsWith(UCP_PATH_PREFIX);
}

// The path is checked after normalization, not as it arrives: "/ucp/%2e%2e/x"
// starts with "/ucp/" but resolves to "/x" on the Shopware origin, and
// "//host/x" resolves to another origin entirely. Returns null for anything
// that is not a UCP path on the Shopware origin.
export function resolveUcpTarget(event: H3Event): URL | null {
  const origin = getShopwareOrigin(event);

  let target: URL;
  try {
    target = new URL(event.path, `${origin}/`);
  } catch {
    return null;
  }

  if (target.origin !== new URL(origin).origin) {
    return null;
  }

  return isUcpPath(target.pathname) ? target : null;
}

function getStorefrontHosts(event: H3Event): string[] {
  return useRuntimeConfig(event)
    .agenticHandoff.storefrontHosts.split(",")
    .map((host: string) => host.trim().toLowerCase())
    .filter(Boolean);
}

export function getRequestedHost(event: H3Event): string {
  return getRequestHost(event, { xForwardedHost: true }).toLowerCase();
}

// Shopware resolves the sales channel, and builds continue_url, the profile
// endpoints and the order permalink, from the host this proxy forwards. The
// host is taken from the request, so a spoofed X-Forwarded-Host could move
// those URLs to another domain. The configured list limits it to the shop's
// own hosts; an empty list trusts the request, which previews need.
export function isStorefrontHost(event: H3Event): boolean {
  const hosts = getStorefrontHosts(event);

  return !hosts.length || hosts.includes(getRequestedHost(event));
}

export function getShopwareOrigin(event: H3Event): string {
  const origin =
    useRuntimeConfig(event).agenticHandoff.shopwareOrigin ||
    getShopwareServerConfig().endpoint.replace(/\/store-api\/?$/, "");

  return origin.replace(/\/+$/, "");
}
