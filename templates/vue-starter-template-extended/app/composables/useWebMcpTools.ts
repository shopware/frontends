import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";
import { onBeforeUnmount, onMounted, watch } from "vue";
import type { Ref } from "vue";

export type WebMcpToolInput = Record<string, unknown>;
export type WebMcpToolHandler = (input: WebMcpToolInput) => Promise<unknown>;
type WebMcpToolHandlers = Record<string, WebMcpToolHandler>;

export type WebMcpTool = {
  name: string;
  title: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
};

type ModelContext = {
  registerTool(
    tool: WebMcpTool & {
      execute(
        input: WebMcpToolInput,
        call?: { signal?: AbortSignal },
      ): Promise<unknown>;
    },
    options: { signal: AbortSignal },
  ): Promise<void>;
};

const LEFT_PAGE = "The shopper left this page. The tool did not run.";
const CANCELLED = "The call was cancelled. The tool did not run.";
const NOT_READY = "The page is still loading. Try again in a few seconds.";
const TOO_SLOW =
  "The shop did not answer in time. The call may still finish, so check the result before you try again.";
const NO_ANSWER = "The shop did not answer. Wait a minute, then try again.";
const SHOP_ERROR = "The shop has a problem right now. Try again later.";
const TIMEOUT_MS = 30_000;
const STOPPED = Symbol("stopped");

// Browser-only state. The plugin registers the tools before the component that runs them mounts.
let handlers: WebMcpToolHandlers | undefined;
let wake: (() => void) | undefined;

/** Runs the registered tools with these handlers while the calling component is mounted. */
export function useWebMcpToolHandlers(next: WebMcpToolHandlers) {
  onMounted(() => {
    handlers = next;
    wake?.();
  });
  onBeforeUnmount(() => {
    if (handlers === next) handlers = undefined;
  });
}

/**
 * Keeps the tools registered while `active` is true. Call it from a client plugin,
 * so agents see the tools before the page hydrates. Calls run one at a time.
 * VueUse's `useWebMCP` is not used: it wraps answers in MCP content blocks,
 * and Chrome passes those to the agent as JSON inside JSON.
 */
export function registerWebMcpTools(
  tools: readonly WebMcpTool[],
  active: Ref<boolean>,
) {
  const { modelContext } = document as Document & {
    modelContext?: ModelContext;
  };
  if (!modelContext) return;

  let queue: Promise<unknown> = Promise.resolve();

  watch(
    active,
    (isActive, _wasActive, onCleanup) => {
      if (!isActive) return;
      const page = new AbortController();
      onCleanup(() => page.abort());

      const registered = tools.map((tool) =>
        modelContext.registerTool(
          {
            ...tool,
            execute(input, call) {
              queue = queue.then(() =>
                runTool(tool.name, input, page.signal, call?.signal),
              );
              return queue;
            },
          },
          { signal: page.signal },
        ),
      );
      // All tools or none, so an agent never sees half a shop.
      Promise.all(registered).catch((error) => {
        if (page.signal.aborted) return;
        console.error("[WebMCP] The tools were not registered:", error);
        page.abort();
      });
    },
    { immediate: true },
  );
}

async function runTool(
  name: string,
  input: WebMcpToolInput,
  page: AbortSignal,
  caller?: AbortSignal,
) {
  const deadline = AbortSignal.timeout(TIMEOUT_MS);
  // Nothing has changed yet, so the call can still stop here.
  const start = AbortSignal.any([page, deadline, ...(caller ? [caller] : [])]);
  if ((await unless(start, served())) === STOPPED) {
    if (page.aborted) return { error: LEFT_PAGE };
    return { error: caller?.aborted ? CANCELLED : NOT_READY };
  }
  const result = await unless(deadline, handle(name, input));
  return result === STOPPED ? { error: TOO_SLOW } : result;
}

const served = () =>
  new Promise<void>((resolve) => {
    if (handlers) resolve();
    else wake = resolve;
  });

/** Resolves with STOPPED when the signal fires before the promise settles. */
function unless<T>(signal: AbortSignal, promise: Promise<T>) {
  const stopped = new Promise<typeof STOPPED>((resolve) => {
    if (signal.aborted) return resolve(STOPPED);
    signal.addEventListener("abort", () => resolve(STOPPED), { once: true });
  });
  return Promise.race([stopped, promise]);
}

// The browser drops the reason of a rejected tool, so errors go back as data.
async function handle(name: string, input: WebMcpToolInput) {
  const handler = handlers?.[name];
  if (!handler) return { error: NOT_READY };
  try {
    return await handler(input);
  } catch (error) {
    return { error: toMessage(error) };
  }
}

function toMessage(error: unknown) {
  if (error instanceof ApiClientError) {
    // Shopware's cart lock message contains the shopper's context token.
    if (error.status === 409) return "The cart is busy. Try again.";
    if (error.status === 429) return NO_ANSWER;
    if (error.status >= 500) return SHOP_ERROR;
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
