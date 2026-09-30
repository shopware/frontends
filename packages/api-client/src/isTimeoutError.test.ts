import type { FetchResponse } from "ofetch";
import { describe, expect, it } from "vitest";

import { ApiClientError } from "./ApiError";
import { isTimeoutError } from "./isTimeoutError";

describe("isTimeoutError", () => {
  it("recognises the FetchError ofetch throws for a timeout", () => {
    const cause = Object.assign(
      new Error("[TimeoutError]: The operation was aborted due to timeout"),
      { name: "TimeoutError" },
    );
    const fetchError = new Error('[GET] "/context": <no response>', { cause });

    expect(isTimeoutError(fetchError)).toBe(true);
  });

  it("recognises a bare TimeoutError", () => {
    expect(isTimeoutError(new DOMException("timed out", "TimeoutError"))).toBe(
      true,
    );
  });

  it.each([
    ["null", null],
    ["a string", "TimeoutError"],
    ["an error without a cause", new Error("boom")],
    [
      "an error with another cause",
      new Error("boom", { cause: new Error("inner") }),
    ],
    ["an abort", new DOMException("aborted", "AbortError")],
  ])("rejects %s", (_name, value) => {
    expect(isTimeoutError(value)).toBe(false);
  });

  it("rejects an API error response", () => {
    const response = {
      ok: false,
      status: 500,
      statusText: "Server Error",
      url: "/context",
      headers: new Headers(),
      _data: { errors: [] },
    } as unknown as FetchResponse<{ errors: [] }>;

    expect(isTimeoutError(new ApiClientError(response))).toBe(false);
  });
});
