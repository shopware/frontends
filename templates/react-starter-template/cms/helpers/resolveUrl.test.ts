import { describe, expect, it } from "vitest";

import { sanitizeHtml } from "../rich-text/sanitize";
import { resolveCmsUrl } from "./resolveUrl";

const PLACEHOLDER = "124c71d524604ccbad6042edce3ac799";

describe("resolveCmsUrl", () => {
  it("rewrites a Shopware navigation placeholder link to a prefixed path", () => {
    expect(resolveCmsUrl(`${PLACEHOLDER}/navigation/abc123#`, "de")).toBe(
      "/de/navigation/abc123#",
    );
    expect(resolveCmsUrl(`${PLACEHOLDER}/navigation/abc123`, "")).toBe(
      "/navigation/abc123",
    );
    expect(resolveCmsUrl(`${PLACEHOLDER}/navigation/abc123?p=2`, "en")).toBe(
      "/en/navigation/abc123?p=2",
    );
    expect(resolveCmsUrl("en-GB/navigation/abc123", "de-DE")).toBe(
      "/de-DE/navigation/abc123",
    );
  });

  it.each([
    "https://example.com/foo/navigation/abc",
    "http://example.com/navigation/abc",
    "//example.com/navigation/abc",
    "https://example.com/navigation/abc",
    "mailto:a@b.c?subject=x/navigation/abc",
    "tel:123/navigation/abc",
    "#section/navigation/abc",
  ])("leaves %s unchanged", (url) => {
    expect(resolveCmsUrl(url, "de")).toBe(url);
  });

  it("does not truncate a multi-segment relative path", () => {
    expect(resolveCmsUrl("a/b/navigation/abc", "de")).toBe(
      "a/b/navigation/abc",
    );
    expect(resolveCmsUrl("/a/navigation/abc", "de")).toBe("/a/navigation/abc");
    expect(resolveCmsUrl("a/navigation/abc/more", "de")).toBe(
      "a/navigation/abc/more",
    );
  });

  it("cannot turn a sanitized href into a javascript: URL", () => {
    const href = "x/javascript://%0aalert(1)/a/navigation/b";
    expect(sanitizeHtml(`<a href="${href}">x</a>`)).toContain(href);

    const resolved = resolveCmsUrl(href, "de");
    expect(resolved).toBe(href);
    expect(resolved.toLowerCase()).not.toMatch(/^\s*javascript:/);
  });

  it("throws on overlong input", () => {
    expect(() => resolveCmsUrl("a".repeat(2084), "")).toThrow();
  });
});
