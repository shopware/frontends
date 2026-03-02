import { describe, expect, it } from "vitest";
import { useSetup } from "../_test";
import { useUrlResolver } from "./useUrlResolver";

describe("useUrlResolver", () => {
  it("resolve url", async () => {
    const { vm } = await useSetup(useUrlResolver);
    expect(vm.resolveUrl("/test-url/abc")).toBe("/test-url/abc");
    expect(() => vm.resolveUrl("x".repeat(2084))).toThrow();
  });

  it("resolve url with navigation pattern and urlPrefix", async () => {
    const { vm } = await useSetup(useUrlResolver, {
      urlPrefix: "shop",
    } as Parameters<typeof useSetup>[1]);

    expect(vm.resolveUrl("/en/navigation/123")).toBe("/shop/en/navigation/123");
  });
});
