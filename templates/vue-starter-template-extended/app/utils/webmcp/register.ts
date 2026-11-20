import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";
import { watch } from "vue";
import type { Ref } from "vue";

export type WebMcpToolInput = Record<string, unknown>;

/** `stop` fires when the shopper leaves, the caller cancels or the time runs out. */
export type WebMcpToolHandler = (
  input: WebMcpToolInput,
  stop: AbortSignal,
) => Promise<unknown>;
type WebMcpToolHandlers = Record<string, WebMcpToolHandler>;

export type WebMcpTool = {
  name: string;
  title: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
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

const LEFT_PAGE =
  "The shopper left this page, so the tool stopped. Nothing was changed.";
const CANCELLED =
  "The call was cancelled, so the tool stopped. Nothing was changed.";
const WAITING =
  "An earlier call is still running, so this one did not run. Try again in a minute.";
const NOT_READY =
  "The page is still loading, so the tool did not run. Try again in a few seconds.";
const TOO_SLOW =
  "The shop did not answer in time. The call may still finish, so check the result before you try again.";
const NO_ANSWER = "The shop did not answer. Wait a minute, then try again.";
const SHOP_ERROR = "The shop has a problem right now. Try again later.";
const STOPPED = Symbol("stopped");

/**
 * Keeps the tools registered while `active` is true. Call it from a client plugin,
 * so agents see the tools before the page hydrates. Returns the function that
 * hands over the handlers; it returns its own undo.
 * VueUse's `useWebMCP` is not used: it wraps answers in MCP content blocks,
 * and Chrome passes those to the agent as JSON inside JSON.
 */
export function registerWebMcpTools(
  tools: readonly WebMcpTool[],
  active: Ref<boolean>,
  { timeout = 30_000 } = {},
) {
  let handlers: WebMcpToolHandlers | undefined;
  let wake: (() => void) | undefined;

  function serve(next: WebMcpToolHandlers) {
    handlers = next;
    wake?.();
    return () => {
      if (handlers === next) handlers = undefined;
    };
  }

  const served = () =>
    new Promise<void>((resolve) => {
      if (handlers) resolve();
      else wake = resolve;
    });
  let queue: Promise<unknown> = Promise.resolve();

  watch(
    active,
    (isActive, _wasActive, onCleanup) => {
      // Looked up each time: an origin trial token can turn the API on late.
      const { modelContext } = document as Document & {
        modelContext?: ModelContext;
      };
      if (!isActive || !modelContext) return;
      const page = new AbortController();
      onCleanup(() => page.abort());

      const registered = tools.map((tool) =>
        modelContext.registerTool(
          {
            ...tool,
            execute(input, call) {
              const caller = call?.signal;
              const deadline = AbortSignal.timeout(timeout);
              const stop = AbortSignal.any([
                page.signal,
                deadline,
                ...(caller ? [caller] : []),
              ]);
              const reason = () => {
                if (page.signal.aborted) return LEFT_PAGE;
                if (caller?.aborted) return CANCELLED;
                return handlers ? WAITING : NOT_READY;
              };
              let running = false;

              const work = queue.then(async () => {
                if ((await unless(stop, served())) === STOPPED) {
                  return { error: reason() };
                }
                const handler = handlers?.[tool.name];
                if (!handler) return { error: NOT_READY };
                running = true;
                // The browser drops the reason of a rejected tool, so errors go back as data.
                try {
                  return await handler(input, stop);
                } catch (error) {
                  if (!stop.aborted) return { error: toMessage(error) };
                  return { error: deadline.aborted ? TOO_SLOW : reason() };
                }
              });
              // The next call waits for this handler, also after its answer went out,
              // but a request that hangs must not block the tools for good.
              queue = unless(AbortSignal.timeout(2 * timeout), work).then(
                (result) => {
                  if (result !== STOPPED) return;
                  console.warn(
                    `[WebMCP] ${tool.name} still runs, the next call starts.`,
                  );
                },
              );

              return unless(deadline, work).then((answer) => {
                if (answer !== STOPPED) return answer;
                return { error: running ? TOO_SLOW : reason() };
              });
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

  return serve;
}

/** Resolves with STOPPED when the signal fires before the promise settles. */
function unless<T>(signal: AbortSignal, promise: Promise<T>) {
  const stopped = new Promise<typeof STOPPED>((resolve) => {
    if (signal.aborted) return resolve(STOPPED);
    signal.addEventListener("abort", () => resolve(STOPPED), { once: true });
  });
  return Promise.race([stopped, promise]);
}

function toMessage(error: unknown) {
  if (error instanceof ApiClientError) {
    // Shopware's cart lock message contains the shopper's context token.
    if (error.status === 409) return "The cart is busy. Try again.";
    if (error.status === 429) return NO_ANSWER;
    if (error.status >= 500) return SHOP_ERROR;
    const details = error.details.errors
      ?.map(({ detail, title }: ApiError) => detail ?? title)
      .join(" ");
    return (details || error.message).slice(0, 300);
  }
  // A rate-limited request has no CORS headers, so it fails without a response.
  if (error instanceof Error && error.name === "FetchError") return NO_ANSWER;
  return error instanceof Error ? error.message : String(error);
}
