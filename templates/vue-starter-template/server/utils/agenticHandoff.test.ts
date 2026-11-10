import { describe, expect, it } from "vitest";

import { CONTEXT_TOKEN_PATTERN } from "../../shared/utils/agenticHandoff";
import {
  isAllowedHost,
  isSameOriginPost,
  resolveUcpPath,
} from "./agenticHandoff";

describe("resolveUcpPath", () => {
  it.each([
    ["/.well-known/ucp", "/.well-known/ucp"],
    ["/.well-known/agent-card.json", "/.well-known/agent-card.json"],
    ["/ucp/mcp?toolsets=other", "/ucp/mcp?toolsets=other"],
    ["/ucp/a/../b?q=1", "/ucp/b?q=1"],
  ])("proxies %s as %s", (path, expected) => {
    expect(resolveUcpPath(path)).toBe(expected);
  });

  it.each([
    "/",
    "/ucp",
    "/ucpx/y",
    "/.well-known/ucpx",
    "/checkout/continue/abc",
    "/ucp/../api/_info/version",
    "/ucp/%2e%2e/api/_info/version",
    "//evil.test/ucp/x",
    "http://evil.test/ucp/x",
  ])("does not proxy %s", (path) => {
    expect(resolveUcpPath(path)).toBeNull();
  });
});

describe("CONTEXT_TOKEN_PATTERN", () => {
  it.each([
    "0123456789abcdef0123456789abcdef",
    "A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6",
  ])("accepts %s", (token) => {
    expect(CONTEXT_TOKEN_PATTERN.test(token)).toBe(true);
  });

  it.each([
    "",
    "a".repeat(31),
    "a".repeat(33),
    `${"a".repeat(31)}-`,
    `${"a".repeat(32)}\n`,
    `../${"a".repeat(29)}`,
  ])("refuses %j", (token) => {
    expect(CONTEXT_TOKEN_PATTERN.test(token)).toBe(false);
  });
});

describe("isAllowedHost", () => {
  it("allows every host while the list is empty", () => {
    expect(isAllowedHost("evil.test", "")).toBe(true);
    expect(isAllowedHost("evil.test", "  ")).toBe(true);
  });

  it("matches listed hosts regardless of case and spaces", () => {
    const list = " Shop.Example.com, localhost:3000 ";

    expect(isAllowedHost("shop.example.com", list)).toBe(true);
    expect(isAllowedHost("SHOP.example.com", list)).toBe(true);
    expect(isAllowedHost("localhost:3000", list)).toBe(true);
  });

  it("refuses other hosts and other ports", () => {
    const list = "shop.example.com,localhost:3000";

    expect(isAllowedHost("evil.test", list)).toBe(false);
    expect(isAllowedHost("shop.example.com.evil.test", list)).toBe(false);
    expect(isAllowedHost("localhost", list)).toBe(false);
    expect(isAllowedHost("localhost:3001", list)).toBe(false);
  });
});

describe("isSameOriginPost", () => {
  const origin = "https://shop.example.com";

  it("trusts Sec-Fetch-Site when the browser sends it", () => {
    expect(isSameOriginPost({ "sec-fetch-site": "same-origin" }, origin)).toBe(
      true,
    );
    for (const site of ["same-site", "cross-site", "none"]) {
      expect(isSameOriginPost({ "sec-fetch-site": site, origin }, origin)).toBe(
        false,
      );
    }
  });

  it("falls back to Origin without Sec-Fetch-Site", () => {
    expect(isSameOriginPost({ origin }, origin)).toBe(true);
    expect(isSameOriginPost({ origin: "https://evil.test" }, origin)).toBe(
      false,
    );
    expect(isSameOriginPost({ origin: "null" }, origin)).toBe(false);
    expect(isSameOriginPost({}, origin)).toBe(false);
  });
});
