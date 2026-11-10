import type { H3Event } from "h3";

// Off by default. A scaffold should neither proxy nor announce UCP until the
// shop runs the plugin (NUXT_PUBLIC_AGENTIC_HANDOFF_ENABLED=true).
export function isHandoffEnabled(event?: H3Event): boolean {
  return useRuntimeConfig(event).public.agenticHandoff.enabled === true;
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

function getStorefrontHosts(event: H3Event): string[] {
  return useRuntimeConfig(event)
    .agenticHandoff.storefrontHosts.split(",")
    .map((host: string) => host.trim().toLowerCase())
    .filter(Boolean);
}

export function getRequestedHost(event: H3Event): string {
  return getRequestHost(event, { xForwardedHost: true }).toLowerCase();
}

export function getRequestedOrigin(event: H3Event): string {
  const protocol = getRequestProtocol(event, { xForwardedProto: true });

  return `${protocol}://${getRequestedHost(event)}`;
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
