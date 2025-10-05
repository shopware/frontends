import { buildUrlPrefix } from "@shopware/helpers";
import { describe, expect, it, vi } from "vitest";
import { useSetup } from "../_test";
import { useUrlResolver } from "./useUrlResolver";

vi.mock("@shopware/helpers", async () => {
  return {
    buildUrlPrefix: vi.fn(),
  };
});

describe("useUrlResolver", () => {
  it("resolve url", async () => {
    const { vm } = await useSetup(useUrlResolver);
    expect(vm.resolveUrl("/test-url/abc")).toBe("/test-url/abc");
    expect(() => vm.resolveUrl("x".repeat(2084))).toThrow();
  });

  it("resolve url with navigation pattern", async () => {
    const { vm } = await useSetup(useUrlResolver);
    vm.resolveUrl("/de/navigation/123");

    expect(buildUrlPrefix).toHaveBeenCalled();
  });
});
