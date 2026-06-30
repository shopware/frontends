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

  it("preserves a caller multipart/form-data that already carries a boundary (pre-encoded body)", () => {
    const headers = resolveRequestHeaders(
      { "Content-Type": "multipart/form-data; boundary=abc123" },
      DEFAULTS,
      "--abc123\r\nContent-Disposition: form-data; name=a\r\n\r\n1\r\n--abc123--",
    );
    expect(contentTypeOf(headers)).toBe("multipart/form-data; boundary=abc123");
  });

  it("still drops a manual boundary for a FormData body (the runtime regenerates it)", () => {
    const headers = resolveRequestHeaders(
      { "Content-Type": "multipart/form-data; boundary=stale" },
      DEFAULTS,
      new FormData(),
    );
    expect(contentTypeOf(headers)).toBeUndefined();
  });

  it("drops a multipart/form-data with an empty/malformed boundary", () => {
    for (const value of [
      "multipart/form-data; boundary=",
      "multipart/form-data; boundary=;x",
    ]) {
      const headers = resolveRequestHeaders(
        { "Content-Type": value },
        DEFAULTS,
        "raw-body",
      );
      expect(contentTypeOf(headers)).toBeUndefined();
    }
  });

  it("preserves a non-JSON client-level default for a runtime-managed body", () => {
    // e.g. client.defaultHeaders.apply({ "Content-Type": "application/octet-stream" })
    const clientDefaults: ClientHeaders = {
      "Content-Type": "application/octet-stream",
      accept: "application/json",
    };
    expect(
      contentTypeOf(
        resolveRequestHeaders(
          undefined,
          clientDefaults,
          new Uint8Array([1, 2]),
        ),
      ),
    ).toBe("application/octet-stream");
    expect(
      contentTypeOf(
        resolveRequestHeaders(undefined, clientDefaults, { pipe() {} }),
      ),
    ).toBe("application/octet-stream");
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
