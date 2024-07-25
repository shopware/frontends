import { describe, expect, it, vi } from "vitest";
import { useWishlist } from "./useWishlist";
import { useSyncWishlist } from "./useSyncWishlist";
import { useUser } from "./useUser";
import { useSetup } from "./_test";
import { computed, ref } from "vue";
import type { Schemas } from "#shopware";

const getMockedUser = (isLoggedIn: boolean, isGuestSession: boolean) =>
  ({
    isLoggedIn: ref(isLoggedIn),
    isGuestSession: ref(isGuestSession),
  }) as ReturnType<typeof useUser>;

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
      count: ref(17),
    };
  },
}));

vi.mock("./useSyncWishlist.ts");
vi.mock("./useUser");

describe("useWishlist - not logged in user", () => {
  it("should merge wishlist products", () => {
    vi.mocked(useUser).mockReturnValue(getMockedUser(false, true));
    vi.mocked(useSyncWishlist).mockReturnValue({
      getWishlistProducts: () => new Promise<void>((resolve) => resolve()),
      items: computed((): string[] => []),
      addToWishlistSync: () => undefined,
      mergeWishlistProducts: () => undefined,
      removeFromWishlistSync: () => undefined,
      count: computed(() => 17),
      currentPage: computed(() => 2),
    });
    const { vm } = useSetup(() => useWishlist());

    vm.clearWishlist();
    vm.getWishlistProducts({ page: 2, limit: 15 });
    vm.mergeWishlistProducts();

    expect(vm.items.length).toBe(17);
    expect(vm.count).toBe(17);
    expect(Number(vm.totalPagesCount)).toBe(2);
  });

  it("should get wishlist products", async () => {
    vi.mocked(useUser).mockReturnValue(getMockedUser(false, true));
    vi.mocked(useSyncWishlist).mockReturnValue({
      getWishlistProducts: () => new Promise<void>((resolve) => resolve()),
      items: computed((): string[] => ["test1"]),
      addToWishlistSync: () => undefined,
      mergeWishlistProducts: () => undefined,
      removeFromWishlistSync: () => undefined,
      count: computed(() => 15),
      currentPage: computed(() => 2),
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
      page: 2,
    } as Schemas["Criteria"];
    vm.getWishlistProducts(query);

    expect(Number(vm.currentPage)).toBe(2);
  });
});

describe("useWishlist - logged in user", () => {
  it("should merge wishlist products", () => {
    vi.mocked(useUser).mockReturnValue(getMockedUser(true, false));
    vi.mocked(useSyncWishlist).mockReturnValue({
      getWishlistProducts: () => new Promise<void>((resolve) => resolve()),
      items: computed((): string[] => {
        return [
          "local-test-1",
          "local-test-2",
          "local-test-3",
          "local-test-4",
          "local-test-5",
          "local-test-6",
          "local-test-7",
          "local-test-8",
          "local-test-9",
          "local-test-10",
          "local-test-11",
          "local-test-12",
          "local-test-13",
          "local-test-14",
          "local-test-15",
        ];
      }),
      addToWishlistSync: () => undefined,
      mergeWishlistProducts: () => undefined,
      removeFromWishlistSync: () => undefined,
      count: computed(() => 15),
      currentPage: computed(() => 1),
    });
    const { vm } = useSetup(() => useWishlist());

    vm.clearWishlist();
    vm.getWishlistProducts();
    vm.mergeWishlistProducts();

    expect(vm.items.length).toBe(15);
    expect(vm.count).toBe(15);
  });

  it("should get wishlist products", () => {
    vi.mocked(useUser).mockReturnValue(getMockedUser(true, false));
    const { vm } = useSetup(() => useWishlist());
    vm.getWishlistProducts();

    expect(vm.items).toEqual([
      "local-test-1",
      "local-test-2",
      "local-test-3",
      "local-test-4",
      "local-test-5",
      "local-test-6",
      "local-test-7",
      "local-test-8",
      "local-test-9",
      "local-test-10",
      "local-test-11",
      "local-test-12",
      "local-test-13",
      "local-test-14",
      "local-test-15",
    ]);
  });
});
