import { describe, expect, it } from "vitest";

import { resolveRedirectTarget } from "./redirect";

describe("resolveRedirectTarget", () => {
  it("falls back to the home page without a target", () => {
    expect(resolveRedirectTarget(null)).toBe("/");
    expect(resolveRedirectTarget(undefined)).toBe("/");
    expect(resolveRedirectTarget("")).toBe("/");
  });

  it("keeps same-origin paths", () => {
    expect(resolveRedirectTarget("/account")).toBe("/account");
    expect(resolveRedirectTarget("/Clothing/Men/?p=2")).toBe(
      "/Clothing/Men/?p=2",
    );
  });

  it("refuses absolute and protocol-relative targets", () => {
    expect(resolveRedirectTarget("https://example.com")).toBe("/");
    expect(resolveRedirectTarget("//example.com/path")).toBe("/");
    expect(resolveRedirectTarget("/\\example.com")).toBe("/");
    expect(resolveRedirectTarget("javascript:alert(1)")).toBe("/");
  });

  it("refuses targets the URL parser would turn into another origin", () => {
    expect(resolveRedirectTarget("/\t/evil.example")).toBe("/");
    expect(resolveRedirectTarget("/\n/evil.example")).toBe("/");
    expect(resolveRedirectTarget("/\r/evil.example")).toBe("/");
    expect(resolveRedirectTarget("/\t\\evil.example")).toBe("/");
    expect(resolveRedirectTarget("/account\u007f")).toBe("/");
  });

  it("uses the given fallback", () => {
    expect(resolveRedirectTarget(null, "/account")).toBe("/account");
    expect(resolveRedirectTarget("https://example.com", "/account")).toBe(
      "/account",
    );
  });
});
