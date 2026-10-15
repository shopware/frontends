/**
 * The only file that touches the browser API. The spec is a W3C community
 * group draft that still moves; keep every assumption about its shape here.
 *
 * Assumed shape (webmachinelearning/webmcp, 2026-10): `document.modelContext`
 * with `registerTool(tool, { signal })`, where aborting the signal unregisters.
 */
import type { JsonSchema, ToolAnnotations } from "./types";

export type ModelContextTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema: JsonSchema;
  annotations?: ToolAnnotations;
  execute(
    input: Record<string, unknown> | undefined,
    context?: { signal?: AbortSignal },
  ): unknown | Promise<unknown>;
};

export type ModelContext = {
  registerTool(
    tool: ModelContextTool,
    options?: { signal?: AbortSignal },
  ): void;
};

type DocumentWithModelContext = Document & { modelContext?: ModelContext };

/**
 * Returns the browser's model context, or `undefined` when the page cannot
 * register tools: not a secure context, or the browser has no WebMCP support.
 */
export function getModelContext(doc?: Document): ModelContext | undefined {
  const target =
    doc ?? (typeof document === "undefined" ? undefined : document);
  if (!target) return undefined;
  const view = target.defaultView;
  if (view && view.isSecureContext === false) return undefined;
  const modelContext = (target as DocumentWithModelContext).modelContext;
  return typeof modelContext?.registerTool === "function"
    ? modelContext
    : undefined;
}

/** Errors the browser throws when the page is not allowed to register tools. */
export function isRegistrationRefusal(error: unknown): boolean {
  const name = (error as { name?: unknown })?.name;
  return name === "NotAllowedError" || name === "InvalidStateError";
}
