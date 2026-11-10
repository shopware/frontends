// Shared between the confirm page and the server routes of the UCP handoff.

// A UCP checkout id is the Shopware context token of the agent's cart:
// 32 hex characters from the plugin, 32 alphanumerics once Shopware rotates it.
export const CONTEXT_TOKEN_PATTERN = /^[A-Za-z0-9]{32}$/;

// Served by the agentic-commerce plugin: the UCP profile, the A2A agent card,
// and every UCP transport (REST, MCP, A2A, embedded, OAuth) under /ucp/.
const UCP_PATHS = new Set(["/.well-known/ucp", "/.well-known/agent-card.json"]);
const UCP_PATH_PREFIX = "/ucp/";

export function isUcpPath(pathname: string): boolean {
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
