import { ApiClientError } from "@shopware/api-client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { effectScope, nextTick, ref } from "vue";
import type { EffectScope } from "vue";

import { registerWebMcpTools } from "./register";
import type { WebMcpToolHandler } from "./register";

type Execute = (
  input: Record<string, unknown>,
  call: { signal: AbortSignal },
) => Promise<unknown>;

const TOOLS = [
  { name: "read", title: "Read", description: "Reads something." },
  { name: "write", title: "Write", description: "Changes something." },
];

const DID_NOT_RUN = { error: expect.stringContaining("did not run") };
const LEFT_PAGE = { error: expect.stringContaining("left this page") };
const TOO_SLOW = { error: expect.stringContaining("did not answer in time") };

/** A promise the test settles by hand. */
function gate() {
  let open = () => {};
  const closed = new Promise<void>((resolve) => {
    open = resolve;
  });
  return { closed, open };
}

/** Lets promise chains and timers that are due run. */
const settle = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

describe("registerWebMcpTools", () => {
  const registered = new Map<string, { title: string; execute: Execute }>();
  const active = ref(true);
  let scope: EffectScope;

  function start(options?: { timeout?: number }) {
    const serve = scope.run(() => registerWebMcpTools(TOOLS, active, options));
    if (!serve) throw new Error("The scope is not active.");
    return serve;
  }

  function call(name: string, signal = new AbortController().signal) {
    const tool = registered.get(name);
    if (!tool) throw new Error(`${name} is not registered.`);
    return tool.execute({}, { signal });
  }

  beforeEach(() => {
    registered.clear();
    active.value = true;
    scope = effectScope();
    vi.stubGlobal("document", {
      modelContext: {
        registerTool(
          tool: { name: string; title: string; execute: Execute },
          { signal }: { signal: AbortSignal },
        ) {
          if (registered.has(tool.name)) {
            return Promise.reject(new Error("Duplicate tool name"));
          }
          registered.set(tool.name, tool);
          signal.addEventListener("abort", () => registered.delete(tool.name));
          return Promise.resolve();
        },
      },
    });
  });

  afterEach(() => {
    scope.stop();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("registers the tools while active and removes them when not", async () => {
    start();
    expect([...registered.keys()]).toEqual(["read", "write"]);
    expect(registered.get("read")?.title).toBe("Read");

    active.value = false;
    await nextTick();
    expect(registered.size).toBe(0);

    active.value = true;
    await nextTick();
    expect(registered.size).toBe(2);
  });

  it("registers no tool when one of them fails", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const other = { title: "Other", execute: async () => "other" };
    registered.set("write", other);

    start();
    await settle();

    expect([...registered.entries()]).toEqual([["write", other]]);
    expect(error).toHaveBeenCalledOnce();
  });

  it("does nothing in a browser without WebMCP", () => {
    vi.stubGlobal("document", {});
    const serve = start();
    expect(() => serve({ read: async () => "ok" })()).not.toThrow();
  });

  it("registers on the next page when the API was turned on late", async () => {
    const withWebMcp = document;
    vi.stubGlobal("document", {});
    active.value = false;
    start();

    vi.stubGlobal("document", withWebMcp);
    active.value = true;
    await nextTick();
    expect(registered.size).toBe(2);
  });

  it("lets a call wait for the handlers", async () => {
    const serve = start();
    const answer = call("read");
    await settle();

    serve({ read: async (input) => ({ input }) });
    expect(await answer).toEqual({ input: {} });
  });

  it("runs one call at a time, in the order they came", async () => {
    const steps: string[] = [];
    const first = gate();
    start()({
      read: async () => {
        steps.push("read starts");
        await first.closed;
        steps.push("read ends");
      },
      write: async () => {
        steps.push("write starts");
      },
    });

    const answers = Promise.all([call("read"), call("write")]);
    await settle();
    expect(steps).toEqual(["read starts"]);

    first.open();
    await answers;
    expect(steps).toEqual(["read starts", "read ends", "write starts"]);
  });

  it("keeps the next call waiting after a timeout, until the slow handler ends", async () => {
    const steps: string[] = [];
    const slow = gate();
    start({ timeout: 100 })({
      write: async () => {
        await slow.closed;
        steps.push("write ends");
      },
      read: async () => {
        steps.push("read starts");
        return "read";
      },
    });

    expect(await call("write")).toEqual(TOO_SLOW);
    const next = call("read");
    await settle();
    expect(steps).toEqual([]);

    slow.open();
    expect(await next).toBe("read");
    expect(steps).toEqual(["write ends", "read starts"]);
  });

  it("never runs a call that ran out of time in the queue", async () => {
    const slow = gate();
    const read = vi.fn<WebMcpToolHandler>(async () => "read");
    start({ timeout: 50 })({ write: () => slow.closed, read });

    void call("write");
    expect(await call("read")).toEqual(DID_NOT_RUN);

    slow.open();
    await settle();
    expect(read).not.toHaveBeenCalled();
  });

  it("stops waiting for a hung call after twice the time limit", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    start({ timeout: 50 })({
      write: () => new Promise(() => {}),
      read: async () => "read",
    });

    expect(await call("write")).toEqual(TOO_SLOW);
    await settle(60);
    expect(await call("read")).toBe("read");
    expect(console.warn).toHaveBeenCalledOnce();
  });

  it("never runs a call that was cancelled in the queue", async () => {
    const slow = gate();
    const read = vi.fn<WebMcpToolHandler>(async () => "read");
    start()({ write: () => slow.closed, read });
    const caller = new AbortController();

    void call("write");
    const answer = call("read", caller.signal);
    caller.abort();
    slow.open();

    expect(await answer).toEqual({
      error: expect.stringContaining("cancelled"),
    });
    expect(read).not.toHaveBeenCalled();
  });

  it("never runs a queued call after the shopper left", async () => {
    const slow = gate();
    const read = vi.fn<WebMcpToolHandler>(async () => "read");
    start()({ write: () => slow.closed, read });

    void call("write");
    const answer = call("read");
    active.value = false;
    await nextTick();
    slow.open();

    expect(await answer).toEqual(LEFT_PAGE);
    expect(read).not.toHaveBeenCalled();
  });

  it("lets a running handler stop before it changes anything", async () => {
    const loaded = gate();
    let changed = false;
    start()({
      write: async (_input, stop) => {
        await loaded.closed;
        stop.throwIfAborted();
        changed = true;
      },
    });

    const answer = call("write");
    await settle();
    active.value = false;
    await nextTick();
    loaded.open();

    expect(await answer).toEqual(LEFT_PAGE);
    expect(changed).toBe(false);
  });

  it("returns the answer of a handler that leaves the page itself", async () => {
    start()({
      write: async () => {
        active.value = false;
        await nextTick();
        return { url: "/checkout" };
      },
    });

    expect(await call("write")).toEqual({ url: "/checkout" });
  });

  it("tells a slow handler that the time ran out", async () => {
    const slow = gate();
    let stopped: boolean | undefined;
    start({ timeout: 50 })({
      write: async (_input, stop) => {
        await slow.closed;
        stopped = stop.aborted;
      },
    });

    expect(await call("write")).toEqual(TOO_SLOW);
    slow.open();
    await settle();
    expect(stopped).toBe(true);
  });

  it("turns failures into messages an agent can act on", async () => {
    const apiError = (status: number, detail: string) =>
      new ApiClientError({
        status,
        _data: { errors: [{ detail }] },
      } as ConstructorParameters<typeof ApiClientError>[0]);
    const failures: [unknown, string][] = [
      [new TypeError("quantity must be a whole number."), "quantity must be"],
      [apiError(409, "Cart with token SECRET is locked"), "The cart is busy"],
      [apiError(429, "Too many requests"), "Wait a minute"],
      [apiError(500, "SQLSTATE[HY000] secret"), "problem right now"],
      [apiError(404, "Could not find product"), "Could not find product"],
      [Object.assign(new Error("x"), { name: "FetchError" }), "Wait a minute"],
    ];
    let failure: unknown;
    start()({
      read: async () => {
        throw failure;
      },
    });

    for (const [thrown, message] of failures) {
      failure = thrown;
      const answer = (await call("read")) as { error: string };
      expect(answer.error).toContain(message);
      expect(answer.error).not.toMatch(/SECRET|SQLSTATE/);
    }

    failure = apiError(400, "x".repeat(2000));
    const long = (await call("read")) as { error: string };
    expect(long.error).toHaveLength(300);
  });
});
