import type { PageContext } from "@shopware/webmcp";

/**
 * What the in-browser agent may know about the page the shopper is looking
 * at. Pages set it; the WebMCP plugin reads it at every tool call and clears
 * it before each navigation. Keep it to URL-derived, non-personal ids.
 */
export function useWebMcpPageContext() {
  return useState<PageContext>("webmcp-page-context", () => ({}));
}
