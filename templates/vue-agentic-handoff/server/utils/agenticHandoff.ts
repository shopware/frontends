import type { H3Event } from "h3";

// Served by the agentic-commerce plugin: the UCP profile, the A2A agent card,
// and every UCP transport (REST, MCP, A2A, embedded, OAuth) under /ucp/.
const UCP_PATHS = new Set(["/.well-known/ucp", "/.well-known/agent-card.json"]);
const UCP_PATH_PREFIX = "/ucp/";

// A UCP checkout id is the Shopware context token of the agent's cart:
// 32 hex characters from the plugin, 32 alphanumerics once Shopware rotates it.
export const CONTEXT_TOKEN_PATTERN = /^[A-Za-z0-9]{32}$/;

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

// Shopware builds continue_url, the profile endpoints and the order permalink
// from the host this proxy reports. Taking it from the request lets a spoofed
// X-Forwarded-Host move those URLs to another domain, and continue_url carries
// a session token. Configured hosts win; the first one is what agents see.
export function getStorefrontHost(event: H3Event): string {
  return (
    getStorefrontHosts(event)[0] ??
    getRequestHost(event, { xForwardedHost: true })
  );
}

export function isStorefrontHost(event: H3Event): boolean {
  const hosts = getStorefrontHosts(event);
  if (!hosts.length) {
    return true;
  }

  return hosts.includes(
    getRequestHost(event, { xForwardedHost: true }).toLowerCase(),
  );
}

export function getShopwareOrigin(event: H3Event): string {
  const config = useRuntimeConfig(event);
  const origin =
    config.agenticHandoff.shopwareOrigin ||
    (config.shopware.endpoint || config.public.shopware.endpoint).replace(
      /\/store-api\/?$/,
      "",
    );

  return origin.replace(/\/+$/, "");
}
