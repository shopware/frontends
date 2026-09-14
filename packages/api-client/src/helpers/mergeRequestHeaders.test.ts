import { describe, expect, it } from "vitest";

import { mergeRequestHeaders } from "./mergeRequestHeaders";

describe("mergeRequestHeaders", () => {
  it("lets a caller header win over a default in any casing", () => {
    expect(
      mergeRequestHeaders(
        { "sw-language-id": "caller" },
        { "Sw-Language-Id": "default", Accept: "application/json" },
      ),
    ).toEqual({ "sw-language-id": "caller", accept: "application/json" });
  });

  it("removes a header set to an empty string in every casing", () => {
    expect(
      mergeRequestHeaders(
        { "SW-CONTEXT-TOKEN": "" },
        { "Sw-Context-Token": "token", "sw-access-key": "key" },
      ),
    ).toEqual({ "sw-access-key": "key" });
  });

  it("keeps the default when the caller header is undefined", () => {
    expect(
      mergeRequestHeaders(
        { "sw-language-id": undefined },
        { "sw-language-id": "default" },
      ),
    ).toEqual({ "sw-language-id": "default" });
  });
});
