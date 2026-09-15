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

  it.each([
    { "sw-context-token": "", "Sw-Context-Token": "token" },
    { "Sw-Context-Token": "token", "sw-context-token": "" },
  ])(
    "removes the header when another casing is set in the same call",
    (callerHeaders) => {
      expect(mergeRequestHeaders(callerHeaders, {})).toEqual({});
    },
  );

  it("skips empty or undefined defaults", () => {
    expect(
      mergeRequestHeaders(undefined, {
        "sw-language-id": undefined,
        "sw-currency-id": "",
        accept: "application/json",
      }),
    ).toEqual({ accept: "application/json" });
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
