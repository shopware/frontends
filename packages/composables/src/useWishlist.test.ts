import { describe, expect, it, vi } from "vitest";
import { useWishlist } from "./useWishlist";
import { useSyncWishlist } from "./useSyncWishlist";
import { useUser } from "./useUser";
import { useSetup } from "./_test";
import { computed, ref } from "vue";
import type { operations } from "#shopware";

vi.mock("./useLocalWishlist.ts", () => ({
  useLocalWishlist() {
    return {
      getWishlistProducts: () => undefined,
      items: {
        value: [
          "local-testId-1",
          "local-testId-2",
          "local-testId-3",
          "local-testId-4",
          "local-testId-5",
          "local-testId-6",
          "local-testId-7",
          "local-testId-8",
          "local-testId-9",
          "local-testId-10",
          "local-testId-11",
          "local-testId-12",
          "local-testId-13",
          "local-testId-14",
          "local-testId-15",
          "local-testId-16",
          "local-testId-17",
        ],
      },
      clearWishlist: () => undefined,
      totalWishlistItemsCount: ref(17),
    };
  },
}));

vi.mock("./useSyncWishlist.ts");
vi.mock("./useUser");

describe("useWishlist - not logged in user", () => {
  it("mergeWishlistProducts", () => {
    vi.mocked(useUser).mockReturnValue({
      isLoggedIn: computed(() => false),
      isGuestSession: computed(() => true),
      // @ts-ignore
      canSyncWishlist: { value: false },
    });
    vi.mocked(useSyncWishlist).mockReturnValue({
      getWishlistProducts: () => undefined,
      // @ts-ignore
      items: { value: ["test1"] },
      mergeWishlistProducts: () => undefined,
      removeFromWishlistSync: () => undefined,
      totalWishlistItemsCount: ref(17),
    });
    const { vm } = useSetup(() => useWishlist());

    vm.clearWishlist();
    vm.getWishlistProducts();
    vm.mergeWishlistProducts();

    expect(vm.items.length).toBe(17);
    expect(vm.totalWishlistItemsCount).toBe(17);
    expect(vm.getTotalPagesCount).toBe(2);
  });

  it("getWishlistProducts", async () => {
    vi.mocked(useUser).mockReturnValue({
      isLoggedIn: computed(() => false),
      isGuestSession: computed(() => true),
      // @ts-ignore
      canSyncWishlist: { value: false },
    });
    vi.mocked(useSyncWishlist).mockReturnValue({
      getWishlistProducts: () => undefined,
      // @ts-ignore
      items: { value: ["test1"] },
      mergeWishlistProducts: () => undefined,
      removeFromWishlistSync: () => undefined,
      totalWishlistItemsCount: ref(15),
    });
    const { vm } = useSetup(() => useWishlist());

    vm.getWishlistProducts();

    expect(vm.items).toEqual([
      "local-testId-1",
      "local-testId-2",
      "local-testId-3",
      "local-testId-4",
      "local-testId-5",
      "local-testId-6",
      "local-testId-7",
      "local-testId-8",
      "local-testId-9",
      "local-testId-10",
      "local-testId-11",
      "local-testId-12",
      "local-testId-13",
      "local-testId-14",
      "local-testId-15",
      "local-testId-16",
      "local-testId-17",
    ]);

    const query = {
      limit: 1,
      p: 2,
    } as operations["searchPage post /search"]["body"];
    vm.changeCurrentPage(2, query);

    expect(vm.getCurrentPage).toBe(2);
  });
});

describe("useWishlist - logged in user", () => {
  it("mergeWishlistProducts", () => {
    // Mock the useUser composable
    vi.mocked(useUser).mockReturnValue({
      isLoggedIn: computed(() => true),
      isGuestSession: computed(() => false),
      // @ts-ignore
      canSyncWishlist: { value: true },
    });
    // Mock the useSyncWishlist composable
    vi.mocked(useSyncWishlist).mockReturnValue({
      getWishlistProducts: () => undefined,
      // @ts-ignore
      items: { value: ["local-testId333"] },
      mergeWishlistProducts: () => undefined,
      removeFromWishlistSync: () => undefined,
      totalWishlistItemsCount: ref(15),
    });
    const { vm } = useSetup(() => useWishlist());

    vm.clearWishlist();
    vm.getWishlistProducts();
    vm.mergeWishlistProducts();

    expect(vm.items.length).toBe(1);
    expect(vm.totalWishlistItemsCount).toBe(15);
  });

  it("getWishlistProducts", () => {
    vi.mocked(useUser).mockReturnValue({
      isLoggedIn: computed(() => true),
      isGuestSession: computed(() => false),
      // @ts-ignore
      canSyncWishlist: { value: true },
    });
    const { vm } = useSetup(() => useWishlist());
    vm.getWishlistProducts();

    expect(vm.items).toEqual(["local-testId333"]);
  });
});
