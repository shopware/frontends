import { describe, expect, it } from "vitest";

import { useSetup } from "../_test";
import { useUrlResolver } from "./useUrlResolver";

const PLACEHOLDER = "124c71d524604ccbad6042edce3ac799";

async function setup(urlPrefix?: string) {
  const { vm } = await useSetup(
    useUrlResolver,
    (urlPrefix === undefined ? undefined : { urlPrefix }) as Parameters<
      typeof useSetup
    >[1],
  );
  return vm;
}

describe("useUrlResolver", () => {
  it("resolve url", async () => {
    const vm = await setup();
    expect(vm.resolveUrl("/test-url/abc")).toBe("/test-url/abc");
    expect(() => vm.resolveUrl("x".repeat(2084))).toThrow();
  });

  it("rewrites a navigation placeholder link and applies the urlPrefix", async () => {
    const vm = await setup("shop");

    expect(vm.resolveUrl(`${PLACEHOLDER}/navigation/123#`)).toBe(
      "/shop/navigation/123#",
    );
    expect(vm.resolveUrl("en-GB/navigation/abc123")).toBe(
      "/shop/navigation/abc123",
    );
    expect(vm.resolveUrl(`${PLACEHOLDER}/navigation/abc?p=2`)).toBe(
      "/shop/navigation/abc?p=2",
    );
  });

  it("rewrites a navigation placeholder link without urlPrefix", async () => {
    const vm = await setup();
    expect(vm.resolveUrl(`${PLACEHOLDER}/navigation/123`)).toBe(
      "/navigation/123",
    );
  });

  it.each([
    "https://example.com/foo/navigation/abc",
    "https://example.com/navigation/abc",
    "http://example.com/navigation/abc",
    "//example.com/navigation/abc",
    "mailto:a@b.c?subject=x/navigation/abc",
    "tel:123/navigation/abc",
    "#section/navigation/abc",
  ])("leaves %s unchanged", async (url) => {
    const vm = await setup("shop");
    expect(vm.resolveUrl(url)).toBe(url);
  });

  it("does not truncate relative paths with extra leading segments", async () => {
    const vm = await setup("shop");
    expect(vm.resolveUrl("a/b/navigation/abc")).toBe("a/b/navigation/abc");
    expect(vm.resolveUrl("/en/navigation/123")).toBe("/en/navigation/123");
    expect(vm.resolveUrl("a/navigation/abc/more")).toBe(
      "a/navigation/abc/more",
    );
  });

  it("cannot turn a relative href into a javascript: URL", async () => {
    const vm = await setup("shop");
    const href = "x/javascript://%0aalert(1)/a/navigation/b";

    const resolved = vm.resolveUrl(href);
    expect(resolved).toBe(href);
    expect(resolved.toLowerCase()).not.toMatch(/^\s*javascript:/);
  });
});
