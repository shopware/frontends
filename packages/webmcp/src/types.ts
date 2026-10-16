/**
 * Contract shared by every transport. Mirrors the server-owned descriptor
 * contract proposed for the Agentic Commerce plugin so a local transport can
 * later be swapped for the plugin dispatcher without touching the host.
 */

/** Bump the major when a descriptor or result shape changes incompatibly. */
export const WEBMCP_CONTRACT_MAJOR = 1;
export const WEBMCP_CONTRACT_VERSION = "1.0";

export type WebMcpMode = "off" | "read_only" | "shopping";

export type ToolAnnotations = {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
  consequentialHint?: boolean;
};

export type JsonSchema = Record<string, unknown>;

export type ToolDescriptor = {
  /** `^[a-z][a-z0-9_]{2,29}$` */
  name: string;
  title: string;
  description: string;
  inputSchema: JsonSchema;
  annotations?: ToolAnnotations;
  /** Lowest mode that exposes the tool. */
  minimumMode: Exclude<WebMcpMode, "off">;
};

/**
 * Frontend-neutral navigation hint. The host maps `target` to its own router;
 * `url` is only filled in by transports that know the storefront's URLs.
 */
export type NextTarget = {
  target: "checkout.confirm" | "checkout.register" | "cart" | "product";
  id?: string;
  url?: string;
};

export type ToolResult = {
  /** What the agent receives. Passed through `JSON.stringify` by the browser. */
  data: unknown;
  next?: NextTarget;
  cartChanged?: boolean;
};

/** Non-personal, URL-derived context of the page the agent is looking at. */
export type PageContext = {
  productId?: string;
  categoryId?: string;
  searchTerm?: string;
};

export type ToolCallContext = {
  signal?: AbortSignal;
  pageContext: PageContext;
};

export type ToolInput = Record<string, unknown>;

export type ToolList = {
  contractVersion: string;
  tools: ToolDescriptor[];
};

export type WebMcpTransport = {
  listTools(): Promise<ToolList>;
  callTool(
    name: string,
    input: ToolInput,
    context: ToolCallContext,
  ): Promise<ToolResult>;
};

export class WebMcpToolError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "tool_not_found"
      | "disabled"
      | "write_in_read_only"
      | "invalid_input"
      | "failed",
  ) {
    super(message);
    this.name = "WebMcpToolError";
  }
}
