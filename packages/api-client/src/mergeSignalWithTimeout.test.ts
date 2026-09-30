import type { FetchOptions } from "ofetch";
import { afterEach, describe, expect, it, vi } from "vitest";

import { isTimeoutError } from "./isTimeoutError";
import { mergeSignalWithTimeout } from "./mergeSignalWithTimeout";

const MAX_TIMEOUT = 2_147_483_647;

function withoutAbortSignalAny(run: () => void) {
  const combine = AbortSignal.any;
  Object.defineProperty(AbortSignal, "any", {
    value: undefined,
    configurable: true,
    writable: true,
  });
  try {
    run();
  } finally {
    Object.defineProperty(AbortSignal, "any", {
      value: combine,
      configurable: true,
      writable: true,
    });
  }
}

describe("mergeSignalWithTimeout", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("combines the caller's signal with the timeout", () => {
    const controller = new AbortController();
    const options: FetchOptions<"json"> = { signal: controller.signal };

    mergeSignalWithTimeout(options, 50);

    expect(options.signal).not.toBe(controller.signal);
    expect(options.signal?.aborted).toBe(false);
  });

  it("drops the timeout it took over, so ofetch cannot arm a second timer", () => {
    const options: FetchOptions<"json"> = {
      signal: new AbortController().signal,
      timeout: 50,
    };

    mergeSignalWithTimeout(options, 5000);

    expect(options.timeout).toBeUndefined();
  });

  it("aborts the merged signal with a TimeoutError once the timeout passes", () => {
    vi.useFakeTimers();
    const options: FetchOptions<"json"> = {
      signal: new AbortController().signal,
    };

    mergeSignalWithTimeout(options, 50);
    vi.advanceTimersByTime(50);

    expect(options.signal?.aborted).toBe(true);
    expect(isTimeoutError(options.signal?.reason)).toBe(true);
  });

  it("lets the caller's signal abort the merged signal", () => {
    const controller = new AbortController();
    const options: FetchOptions<"json"> = { signal: controller.signal };

    mergeSignalWithTimeout(options, 5000);
    controller.abort();

    expect(options.signal?.aborted).toBe(true);
    expect(isTimeoutError(options.signal?.reason)).toBe(false);
  });

  it("releases the timer, so a settled request leaves nothing pending", () => {
    vi.useFakeTimers();
    const options: FetchOptions<"json"> = {
      signal: new AbortController().signal,
    };

    const releaseTimeout = mergeSignalWithTimeout(options, 50);
    releaseTimeout();

    expect(vi.getTimerCount()).toBe(0);

    vi.advanceTimersByTime(1000);
    expect(options.signal?.aborted).toBe(false);
  });

  it("prefers the per-request timeout over the client timeout", () => {
    vi.useFakeTimers();
    const options: FetchOptions<"json"> = {
      signal: new AbortController().signal,
      timeout: 50,
    };

    mergeSignalWithTimeout(options, 5000);
    vi.advanceTimersByTime(50);

    expect(options.signal?.aborted).toBe(true);
  });

  it("rounds a fractional timeout up to whole milliseconds", () => {
    vi.useFakeTimers();
    const options: FetchOptions<"json"> = {
      signal: new AbortController().signal,
      timeout: 49.2,
    };

    mergeSignalWithTimeout(options, undefined);
    vi.advanceTimersByTime(49);
    expect(options.signal?.aborted).toBe(false);

    vi.advanceTimersByTime(1);
    expect(options.signal?.aborted).toBe(true);
  });

  it.each([
    ["a negative timeout", -5],
    ["an infinite timeout", Number.POSITIVE_INFINITY],
    ["NaN", Number.NaN],
    ["zero", 0],
  ])("ignores %s instead of throwing", (_name, timeout) => {
    const controller = new AbortController();
    const options: FetchOptions<"json"> = {
      signal: controller.signal,
      timeout,
    };

    const releaseTimeout = mergeSignalWithTimeout(options, undefined);

    expect(options.timeout).toBeUndefined();
    expect(options.signal).toBe(controller.signal);
    expect(releaseTimeout).not.toThrow();
  });

  it("ignores an unusable client timeout the same way", () => {
    const controller = new AbortController();
    const options: FetchOptions<"json"> = { signal: controller.signal };

    mergeSignalWithTimeout(options, Number.POSITIVE_INFINITY);

    expect(options.timeout).toBeUndefined();
    expect(options.signal).toBe(controller.signal);
  });

  it("caps a timeout that a 32-bit timer cannot hold", () => {
    const options: FetchOptions<"json"> = { timeout: MAX_TIMEOUT + 1000 };

    mergeSignalWithTimeout(options, undefined);

    expect(options.timeout).toBe(MAX_TIMEOUT);
  });

  it.each([
    ["a numeric string", "50", 50],
    ["a fractional numeric string", "49.2", 50],
  ])("still waits for %s timeout", (_name, timeout, expected) => {
    const options = { timeout } as unknown as FetchOptions<"json">;

    mergeSignalWithTimeout(options, undefined);

    expect(options.timeout).toBe(expected);
  });

  it("ignores a string that is not a number", () => {
    const options = { timeout: "soon" } as unknown as FetchOptions<"json">;

    mergeSignalWithTimeout(options, undefined);

    expect(options.timeout).toBeUndefined();
  });

  it("resolves the client timeout onto the request when there is no signal", () => {
    const options: FetchOptions<"json"> = {};

    const releaseTimeout = mergeSignalWithTimeout(options, 50.5);

    expect(options.timeout).toBe(51);
    expect(options.signal).toBeUndefined();
    expect(releaseTimeout).not.toThrow();
  });

  it("keeps the caller's signal alone where AbortSignal.any is missing", () => {
    const controller = new AbortController();
    const options: FetchOptions<"json"> = { signal: controller.signal };

    withoutAbortSignalAny(() => {
      const releaseTimeout = mergeSignalWithTimeout(options, 50);
      expect(releaseTimeout).not.toThrow();
    });

    expect(options.signal).toBe(controller.signal);
    expect(options.timeout).toBe(50);
  });
});
