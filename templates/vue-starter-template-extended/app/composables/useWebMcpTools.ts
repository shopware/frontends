import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";
import { onBeforeUnmount, onMounted } from "vue";

export type WebMcpToolInput = Record<string, unknown>;

export type WebMcpTool = {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: WebMcpToolInput) => Promise<unknown>;
};

type ModelContext = {
  registerTool(
    tool: WebMcpTool,
    options: { signal: AbortSignal },
  ): Promise<void>;
};

const LEFT_PAGE = "The shopper left this page. The tool did not run.";
const NO_ANSWER = "The shop did not answer. Wait a minute, then try again.";
const TIMEOUT_MS = 30_000;

/**
 * Registers WebMCP tools while the calling component is mounted.
 * Calls run one at a time, like a shopper clicking.
 * Swap for `useWebMCP` from `@vueuse/core` once the workspace drops its 14.4.0 pin.
 */
export function useWebMcpTools(tools: WebMcpTool[]) {
  const controller = new AbortController();
  let queue: Promise<unknown> = Promise.resolve();

  onMounted(() => {
    const { modelContext } = document as Document & {
      modelContext?: ModelContext;
    };
    if (!modelContext) return;

    for (const tool of tools) {
      const execute = (input: WebMcpToolInput) =>
        (queue = queue.then(() =>
          controller.signal.aborted
            ? { error: LEFT_PAGE }
            : Promise.race([runTool(tool, input), timeout()]),
        ));
      modelContext
        .registerTool({ ...tool, execute }, { signal: controller.signal })
        .catch((error) => console.error(`[WebMCP] ${tool.name}:`, error));
    }
  });

  onBeforeUnmount(() => controller.abort());
}

const timeout = () =>
  new Promise((resolve) =>
    setTimeout(resolve, TIMEOUT_MS, { error: NO_ANSWER }),
  );

// The browser drops the reason of a rejected tool, so errors go back as data.
async function runTool(tool: WebMcpTool, input?: WebMcpToolInput) {
  try {
    return await tool.execute(input ?? {});
  } catch (error) {
    return { error: toMessage(error) };
  }
}

function toMessage(error: unknown) {
  if (error instanceof ApiClientError) {
    // Shopware's cart lock message contains the shopper's context token.
    if (error.status === 409) return "The cart is busy. Try again.";
    if (error.status === 429) return NO_ANSWER;
    return (
      error.details.errors
        ?.map(({ detail, title }: ApiError) => detail ?? title)
        .join(" ") || error.message
    );
  }
  // A rate-limited request has no CORS headers, so it fails without a response.
  if (error instanceof Error && error.name === "FetchError") return NO_ANSWER;
  return error instanceof Error ? error.message : String(error);
}
