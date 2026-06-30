import { describe, expect, it } from "vitest";

import type { ClientHeaders } from "./defaultHeaders";
import { resolveRequestHeaders } from "./resolveRequestHeaders";

const DEFAULTS: ClientHeaders = {
  "Content-Type": "application/json",
  accept: "application/json",
};

function contentTypeOf(headers: ClientHeaders): string | undefined {
  return Object.entries(headers).find(
    ([key]) => key.toLowerCase() === "content-type",
  )?.[1];
}

describe("resolveRequestHeaders", () => {
  it("keeps the default application/json for a plain object body", () => {
    const headers = resolveRequestHeaders(undefined, DEFAULTS, { id: "1" });
    expect(contentTypeOf(headers)).toBe("application/json");
    expect(headers.accept).toBe("application/json");
  });

  it("keeps the default when there is no body", () => {
    const headers = resolveRequestHeaders(undefined, DEFAULTS, undefined);
    expect(contentTypeOf(headers)).toBe("application/json");
  });

  it("returns the merged headers when no Content-Type is present at all", () => {
    const headers = resolveRequestHeaders(
      { "sw-access-key": "key" },
      { accept: "application/json" },
      new FormData(),
    );
    expect(contentTypeOf(headers)).toBeUndefined();
    expect(headers).toEqual({
      "sw-access-key": "key",
      accept: "application/json",
    });
  });

  it("drops the default Content-Type for a FormData body", () => {
    const body = new FormData();
    body.append("file", new Blob(["x"]), "f.txt");
    const headers = resolveRequestHeaders(undefined, DEFAULTS, body);
    expect(contentTypeOf(headers)).toBeUndefined();
    expect(headers.accept).toBe("application/json");
  });

  it("drops a manually set multipart/form-data (no boundary) for FormData", () => {
    const body = new FormData();
    const headers = resolveRequestHeaders(
      { "Content-Type": "multipart/form-data" },
      DEFAULTS,
      body,
    );
    expect(contentTypeOf(headers)).toBeUndefined();
  });

  it("drops the default Content-Type for a URLSearchParams body", () => {
    const headers = resolveRequestHeaders(
      undefined,
      DEFAULTS,
      new URLSearchParams({ a: "1" }),
    );
    expect(contentTypeOf(headers)).toBeUndefined();
  });

  it("drops the default Content-Type for a Blob body", () => {
    const headers = resolveRequestHeaders(
      undefined,
      DEFAULTS,
      new Blob(["x"], { type: "image/png" }),
    );
    expect(contentTypeOf(headers)).toBeUndefined();
  });

  it("drops the default Content-Type for binary bodies (ArrayBuffer / typed array)", () => {
    const view = new Uint8Array([1, 2, 3]);
    expect(
      contentTypeOf(resolveRequestHeaders(undefined, DEFAULTS, view)),
    ).toBeUndefined();
    expect(
      contentTypeOf(resolveRequestHeaders(undefined, DEFAULTS, view.buffer)),
    ).toBeUndefined();
  });

  it("drops the default Content-Type for a stream-like body", () => {
    const stream = { pipe() {} };
    expect(
      contentTypeOf(resolveRequestHeaders(undefined, DEFAULTS, stream)),
    ).toBeUndefined();
  });

  it("preserves a Content-Type the caller set explicitly for a Blob", () => {
    const headers = resolveRequestHeaders(
      { "Content-Type": "image/png" },
      DEFAULTS,
      new Blob(["x"]),
    );
    expect(contentTypeOf(headers)).toBe("image/png");
  });

  it("preserves a caller Content-Type set with a lowercase key", () => {
    const headers = resolveRequestHeaders(
      { "content-type": "application/pdf" },
      DEFAULTS,
      new Blob(["x"]),
    );
    expect(contentTypeOf(headers)).toBe("application/pdf");
  });
});
