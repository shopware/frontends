import { describe, expect, it, vi } from "vitest";
import { useWishlist } from "./useWishlist";
import { useSetup } from "./_test";

describe("useWishlist - not logged in user", () => {
  vi.mock("./useLocalWishlist.ts", () => ({
    useLocalWishlist() {
      return {
        getWishlistProducts: () => undefined,
        items: { value: ["local-testId333"] },
        clearWishlist: () => undefined,
      };
    },
  }));

  it("mergeWishlistProducts", async () => {
    const { vm } = useSetup(() => useWishlist());

    expect(vm.items.length).toBe(1);
    expect(vm.totalWishlistItemsCount).toBe(1);
    await vm.clearWishlist();
    await vm.getWishlistProducts();
    await vm.mergeWishlistProducts();
  });
});

describe("useWishlist - logged in user", () => {
  it("mergeWishlistProducts", async () => {
    const { vm } = useSetup(() => useWishlist());

    expect(vm.items.length).toBe(1);
    expect(vm.totalWishlistItemsCount).toBe(1);
    await vm.clearWishlist();
    await vm.getWishlistProducts();
    await vm.mergeWishlistProducts();
  });
});
