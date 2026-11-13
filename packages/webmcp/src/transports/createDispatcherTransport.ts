/**
 * Transport for the server-owned dispatcher proposed for the Agentic Commerce
 * plugin (`/store-api/agentic-commerce/webmcp/tools[/{name}]`). The routes do
 * not exist yet, so this is the shape only: untested against a real backend.
 *
 * The plugin routes are not part of the generated Store API types, so the
 * api-client is called through a loosely typed `invoke`.
 */
import type {
  ToolCallContext,
  ToolInput,
  ToolList,
  ToolResult,
  WebMcpTransport,
} from "../types";

type LooseInvoke = {
  invoke(
    path: string,
    params?: {
      pathParams?: Record<string, string>;
      body?: unknown;
      fetchOptions?: { signal?: AbortSignal };
    },
  ): Promise<{ data: unknown }>;
};

export function createDispatcherTransport(apiClient: {
  invoke: (...args: never[]) => unknown;
}): WebMcpTransport {
  const client = apiClient as unknown as LooseInvoke;
  return {
    async listTools(): Promise<ToolList> {
      const { data } = await client.invoke(
        "webMcpListTools get /agentic-commerce/webmcp/tools",
      );
      return data as ToolList;
    },
    async callTool(
      name: string,
      input: ToolInput,
      context: ToolCallContext,
    ): Promise<ToolResult> {
      const { data } = await client.invoke(
        "webMcpCallTool post /agentic-commerce/webmcp/tools/{name}",
        {
          pathParams: { name },
          body: { input, pageContext: context.pageContext },
          fetchOptions: { signal: context.signal },
        },
      );
      return data as ToolResult;
    },
  };
}
