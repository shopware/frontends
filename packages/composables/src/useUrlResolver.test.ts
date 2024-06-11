import { describe, expect, it } from "vitest";
import { useUrlResolver } from "./useUrlResolver";
import { useSetup } from "./_test";

describe("useUrlResolver", () => {
  it("resolve url", async () => {
    const { vm } = await useSetup(useUrlResolver);
    expect(vm.resolveUrl("/test-url/abc")).toBe("/test-url/abc");
    expect(() => vm.resolveUrl("x".repeat(2084))).toThrow();
  });
});
