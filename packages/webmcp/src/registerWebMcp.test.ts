import { describe, expect, it, vi } from "vitest";

import type { ModelContextTool } from "./modelContext";
import { registerWebMcp } from "./registerWebMcp";
import type { ToolDescriptor, WebMcpTransport } from "./types";

const descriptor: ToolDescriptor = {
  name: "get_cart",
  title: "Cart",
  description: "Reads the cart",
  inputSchema: { type: "object", properties: {} },
  annotations: { readOnlyHint: true },
  minimumMode: "read_only",
};

function fakeTransport(
  overrides: Partial<WebMcpTransport> = {},
  contractVersion = "1.0",
): WebMcpTransport {
  return {
    listTools: vi.fn(async () => ({ contractVersion, tools: [descriptor] })),
    callTool: vi.fn(async () => ({ data: { ok: true } })),
    ...overrides,
  };
}

type Registered = { tool: ModelContextTool; signal?: AbortSignal };

function documentWithModelContext(registerTool?: (...args: never[]) => void) {
  const registered: Registered[] = [];
  const doc = document.implementation.createHTMLDocument();
  Object.defineProperty(doc, "modelContext", {
    value: {
      registerTool:
        registerTool ??
        ((tool: ModelContextTool, options?: { signal?: AbortSignal }) => {
          registered.push({ tool, signal: options?.signal });
        }),
    },
  });
  return { doc, registered };
}

const silent = { warn: vi.fn() };

describe("registerWebMcp", () => {
  it("registers nothing when the browser has no model context", async () => {
    const transport = fakeTransport();
    const handle = await registerWebMcp({ transport, logger: silent });

    expect(handle.registered).toBe(false);
    expect(handle.tools).toEqual([descriptor]);
    await expect(handle.call("get_cart")).resolves.toEqual({
      data: { ok: true },
    });
  });

  it("registers one tool per descriptor with a shared abort signal", async () => {
    const { doc, registered } = documentWithModelContext();
    const transport = fakeTransport();
    const handle = await registerWebMcp({ transport, document: doc });

    expect(handle.registered).toBe(true);
    expect(registered).toHaveLength(1);
    expect(registered[0]?.tool.name).toBe("get_cart");
    expect(registered[0]?.signal?.aborted).toBe(false);

    handle.dispose();
    expect(registered[0]?.signal?.aborted).toBe(true);
  });

  it("passes the page context and returns only the data to the browser", async () => {
    const { doc, registered } = documentWithModelContext();
    const transport = fakeTransport();
    const signal = new AbortController().signal;

    await registerWebMcp({
      transport,
      document: doc,
      pageContext: () => ({ productId: "p1" }),
    });
    const result = await registered[0]?.tool.execute({ a: 1 }, { signal });

    expect(result).toEqual({ ok: true });
    expect(transport.callTool).toHaveBeenCalledWith(
      "get_cart",
      { a: 1 },
      { signal, pageContext: { productId: "p1" } },
    );
  });

  it("refuses an unknown contract major", async () => {
    const { doc, registered } = documentWithModelContext();
    const handle = await registerWebMcp({
      transport: fakeTransport({}, "2.0"),
      document: doc,
      logger: silent,
    });

    expect(handle.registered).toBe(false);
    expect(handle.tools).toEqual([]);
    expect(registered).toHaveLength(0);
    await expect(handle.call("get_cart")).rejects.toThrow("not registered");
  });

  it("stops quietly when the page may not register tools", async () => {
    const { doc } = documentWithModelContext(() => {
      throw new DOMException("blocked", "NotAllowedError");
    });
    const handle = await registerWebMcp({
      transport: fakeTransport(),
      document: doc,
      logger: silent,
    });

    expect(handle.registered).toBe(false);
    expect(silent.warn).toHaveBeenCalled();
  });

  it("rethrows unexpected registration errors", async () => {
    const { doc } = documentWithModelContext(() => {
      throw new TypeError("bad signature");
    });

    await expect(
      registerWebMcp({ transport: fakeTransport(), document: doc }),
    ).rejects.toThrow("bad signature");
  });

  it("calls onCartChanged and navigates after the result resolves", async () => {
    vi.useFakeTimers();
    const onCartChanged = vi.fn();
    const navigate = vi.fn();
    const transport = fakeTransport({
      callTool: vi.fn(async () => ({
        data: { status: "ready_for_confirmation" },
        next: { target: "checkout.confirm" as const },
        cartChanged: true,
      })),
    });

    const handle = await registerWebMcp({ transport, onCartChanged, navigate });
    const result = await handle.call("start_checkout");

    expect(result.data).toEqual({ status: "ready_for_confirmation" });
    expect(onCartChanged).toHaveBeenCalledOnce();
    expect(navigate).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(navigate).toHaveBeenCalledWith({ target: "checkout.confirm" });
    vi.useRealTimers();
  });

  it("isolates host callback failures from the tool result", async () => {
    const transport = fakeTransport({
      callTool: vi.fn(async () => ({ data: {}, cartChanged: true })),
    });
    const handle = await registerWebMcp({
      transport,
      logger: silent,
      onCartChanged: () => {
        throw new Error("widget broke");
      },
    });

    await expect(handle.call("add_to_cart")).resolves.toEqual({
      data: {},
      cartChanged: true,
    });
  });

  it("reports tool failures to the browser as OperationError", async () => {
    const { doc, registered } = documentWithModelContext();
    const transport = fakeTransport({
      callTool: vi.fn(async () => {
        throw new Error("The cart is empty");
      }),
    });
    await registerWebMcp({ transport, document: doc });

    await expect(registered[0]?.tool.execute({})).rejects.toMatchObject({
      name: "OperationError",
      message: "The cart is empty",
    });
  });
});
