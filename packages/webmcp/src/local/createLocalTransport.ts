/**
 * Transport that executes the tools in the browser against the standard Store
 * API through the app's own api-client. No backend plugin needed, so a
 * headless frontend can ship WebMCP today. Trade-off: the tool contract lives
 * in this package instead of on the server.
 */
import { WEBMCP_CONTRACT_VERSION, WebMcpToolError } from "../types";
import type {
  ToolCallContext,
  ToolInput,
  ToolList,
  ToolResult,
  WebMcpMode,
  WebMcpTransport,
} from "../types";
import type { LocalTool, StoreApiClient } from "./tool";
import {
  addToCart,
  applyPromotionCode,
  getCart,
  updateCartItem,
} from "./tools/cart";
import { getProduct } from "./tools/getProduct";
import { searchProducts } from "./tools/searchProducts";
import { startCheckout } from "./tools/startCheckout";

export const localTools: LocalTool[] = [
  searchProducts,
  getProduct,
  getCart,
  addToCart,
  updateCartItem,
  applyPromotionCode,
  startCheckout,
];

const MODE_RANK: Record<WebMcpMode, number> = {
  off: 0,
  read_only: 1,
  shopping: 2,
};

export function modeAllows(mode: WebMcpMode, minimumMode: WebMcpMode): boolean {
  return MODE_RANK[mode] >= MODE_RANK[minimumMode];
}

export type LocalTransportOptions = {
  apiClient: StoreApiClient;
  /** @default "off" */
  mode?: WebMcpMode;
  /** Override or extend the built-in tool set. */
  tools?: LocalTool[];
};

export function createLocalTransport(
  options: LocalTransportOptions,
): WebMcpTransport {
  const mode = options.mode ?? "off";
  const tools = options.tools ?? localTools;

  return {
    async listTools(): Promise<ToolList> {
      return {
        contractVersion: WEBMCP_CONTRACT_VERSION,
        tools: tools
          .filter((tool) => modeAllows(mode, tool.descriptor.minimumMode))
          .map((tool) => tool.descriptor),
      };
    },
    async callTool(
      name: string,
      input: ToolInput,
      context: ToolCallContext,
    ): Promise<ToolResult> {
      const tool = tools.find(
        (candidate) => candidate.descriptor.name === name,
      );
      if (!tool) {
        throw new WebMcpToolError(`Unknown tool ${name}`, "tool_not_found");
      }
      if (mode === "off") {
        throw new WebMcpToolError("WebMCP is disabled", "disabled");
      }
      // Checked again on execute: a stale page can still ask for a hidden tool.
      if (!modeAllows(mode, tool.descriptor.minimumMode)) {
        throw new WebMcpToolError(
          `${name} is not available in ${mode} mode`,
          "write_in_read_only",
        );
      }
      return tool.run(input, context, options.apiClient);
    },
  };
}
