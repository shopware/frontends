import { describe, expect, it, vi } from "vitest";
import { useInternationalization } from "./useInternationalization";
import { useSetup } from "./_test";

describe("useInternationalization", () => {
  it("should return storefrontUrl", async () => {
    const url = "http://frontend.test";
    vi.stubGlobal("location", {
      origin: url,
    });
    const { vm } = useSetup(useInternationalization);

    expect(vm.getStorefrontUrl()).toBe(url);

    vi.unstubAllGlobals();
  });

  it("should return default window storefrontUrl", async () => {
    const { vm } = useSetup(useInternationalization);

    expect(vm.getStorefrontUrl()).toBe("http://localhost:3000");
  });
});
