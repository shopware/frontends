import { getModelContext, isRegistrationRefusal } from "./modelContext";
import type { ModelContext } from "./modelContext";
import { WEBMCP_CONTRACT_MAJOR } from "./types";
import type {
  NextTarget,
  PageContext,
  ToolDescriptor,
  ToolInput,
  ToolResult,
  WebMcpTransport,
} from "./types";

export type RegisterWebMcpOptions = {
  transport: WebMcpTransport;
  /** Maps a frontend-neutral target to the host's router. */
  navigate?: (next: NextTarget) => unknown;
  /** Called after any tool reports `cartChanged`. */
  onCartChanged?: () => unknown;
  /** Read at call time, so SPA navigation is reflected without re-registering. */
  pageContext?: () => PageContext;
  /** Test seam; defaults to the global document. */
  document?: Document;
  logger?: Pick<Console, "warn">;
};

export type WebMcpHandle = {
  /** `true` when the tools were handed to the browser. */
  registered: boolean;
  tools: ToolDescriptor[];
  /** Runs a tool the same way the browser would. Works without WebMCP support. */
  call(name: string, input?: ToolInput): Promise<ToolResult>;
  /** Unregisters every tool. Call on SPA teardown. */
  dispose(): void;
};

function parseMajor(version: string): number {
  return Number.parseInt(version.split(".")[0] ?? "", 10);
}

async function safely(
  callback: (() => unknown) | undefined,
  logger: Pick<Console, "warn">,
  what: string,
): Promise<void> {
  if (!callback) return;
  try {
    await callback();
  } catch (error) {
    logger.warn(`[webmcp] ${what} failed`, error);
  }
}

function toOperationError(error: unknown): Error {
  const message = error instanceof Error ? error.message : "Tool call failed";
  const operationError = new Error(message);
  operationError.name = "OperationError";
  return operationError;
}

/**
 * Fetches the tool descriptors from the transport and registers each one with
 * `document.modelContext`. Does nothing, quietly, when the browser has no
 * WebMCP support, the page may not register tools, or the mode exposes none.
 */
export async function registerWebMcp(
  options: RegisterWebMcpOptions,
): Promise<WebMcpHandle> {
  const logger = options.logger ?? console;
  const controller = new AbortController();
  const { transport } = options;

  const list = await transport.listTools();
  if (parseMajor(list.contractVersion) !== WEBMCP_CONTRACT_MAJOR) {
    logger.warn(
      `[webmcp] contract ${list.contractVersion} is not supported by this package (expects ${WEBMCP_CONTRACT_MAJOR}.x); registering nothing`,
    );
    return { registered: false, tools: [], call: refuse, dispose: noop };
  }

  async function call(
    name: string,
    input: ToolInput = {},
    signal?: AbortSignal,
  ): Promise<ToolResult> {
    const result = await transport.callTool(name, input, {
      signal,
      pageContext: options.pageContext?.() ?? {},
    });
    if (result.cartChanged) {
      await safely(options.onCartChanged, logger, "onCartChanged");
    }
    if (result.next && options.navigate && !signal?.aborted) {
      // Let the agent receive the result before the document may unload.
      const next = result.next;
      setTimeout(() => {
        void safely(() => options.navigate?.(next), logger, "navigate");
      }, 0);
    }
    return result;
  }

  const registered = registerAll(
    getModelContext(options.document),
    list.tools,
    call,
    controller.signal,
    logger,
  );

  return {
    registered,
    tools: list.tools,
    call: (name, input) => call(name, input),
    dispose: () => controller.abort(),
  };
}

function registerAll(
  modelContext: ModelContext | undefined,
  tools: ToolDescriptor[],
  call: (
    name: string,
    input: ToolInput,
    signal?: AbortSignal,
  ) => Promise<ToolResult>,
  signal: AbortSignal,
  logger: Pick<Console, "warn">,
): boolean {
  if (!modelContext || tools.length === 0) return false;
  try {
    for (const tool of tools) {
      modelContext.registerTool(
        {
          name: tool.name,
          title: tool.title,
          description: tool.description,
          inputSchema: tool.inputSchema,
          annotations: tool.annotations,
          async execute(input, context) {
            try {
              const result = await call(
                tool.name,
                input ?? {},
                context?.signal,
              );
              return result.data;
            } catch (error) {
              throw toOperationError(error);
            }
          },
        },
        { signal },
      );
    }
    return true;
  } catch (error) {
    if (isRegistrationRefusal(error)) {
      logger.warn("[webmcp] the page may not register tools", error);
      return false;
    }
    throw error;
  }
}

function refuse(): Promise<ToolResult> {
  return Promise.reject(new Error("WebMCP is not registered"));
}

function noop(): void {}
