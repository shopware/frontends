import { describe, expect, it, vi } from "vitest";
import { useWishlist } from "./useWishlist";
import { useSyncWishlist } from "./useSyncWishlist";
import { useUser } from "./useUser";
import { useSetup } from "./_test";
import { computed, ref } from "vue";

const getMockedUser = (isLoggedIn: boolean, isGuestSession: boolean) =>
  ({
    isLoggedIn: ref(isLoggedIn),
    isGuestSession: ref(isGuestSession),
  }) as ReturnType<typeof useUser>;

const generateTestProducts = (count: number) => {
  const products = [];
  for (let i = 1; i <= count; i++) {
    products.push(`local-testId-${i}`);
  }
  return products;
};

vi.mock("./useLocalWishlist.ts", () => ({
  useLocalWishlist() {
    return {
      getWishlistProducts: () => undefined,
      items: {
        value: generateTestProducts(17),
      },
      clearWishlist: () => undefined,
      count: ref(17),
    };
  },
}));

vi.mock("./useSyncWishlist.ts");
vi.mock("./useUser");

describe("useWishlist - not logged in user", () => {
  it("mergeWishlistProducts", () => {
    vi.mocked(useUser).mockReturnValue(getMockedUser(false, true));
    vi.mocked(useSyncWishlist).mockReturnValue({
      getWishlistProducts: () => new Promise<void>((resolve) => resolve()),
      items: computed((): string[] => {
        return ["test1"];
      }),
      addToWishlistSync: () => undefined,
      mergeWishlistProducts: () => undefined,
      removeFromWishlistSync: () => undefined,
      count: computed(() => 17),
    });
    const { vm } = useSetup(() => useWishlist());

    vm.clearWishlist();
    vm.getWishlistProducts();
    vm.mergeWishlistProducts();

    expect(vm.items.length).toBe(17);
    expect(vm.count).toBe(17);
  });

  it("getWishlistProducts", async () => {
    vi.mocked(useUser).mockReturnValue(getMockedUser(false, true));
    vi.mocked(useSyncWishlist).mockReturnValue({
      getWishlistProducts: () => new Promise<void>((resolve) => resolve()),
      items: computed((): string[] => {
        return ["test1"];
      }),
      addToWishlistSync: () => undefined,
      mergeWishlistProducts: () => undefined,
      removeFromWishlistSync: () => undefined,
      count: computed(() => 15),
    });
    const { vm } = useSetup(() => useWishlist());

    vm.getWishlistProducts();

    expect(vm.items).toEqual(generateTestProducts(17));
  });
});

describe("useWishlist - logged in user", () => {
  it("mergeWishlistProducts", () => {
    vi.mocked(useUser).mockReturnValue(getMockedUser(true, false));
    vi.mocked(useSyncWishlist).mockReturnValue({
      getWishlistProducts: () => new Promise<void>((resolve) => resolve()),
      items: computed((): string[] => {
        return generateTestProducts(15);
      }),
      addToWishlistSync: () => undefined,
      mergeWishlistProducts: () => undefined,
      removeFromWishlistSync: () => undefined,
      count: computed(() => 15),
    });
    const { vm } = useSetup(() => useWishlist());

    vm.clearWishlist();
    vm.getWishlistProducts();
    vm.mergeWishlistProducts();

    expect(vm.items.length).toBe(15);
    expect(vm.count).toBe(15);
  });

  it("getWishlistProducts", () => {
    vi.mocked(useUser).mockReturnValue(getMockedUser(true, false));
    const { vm } = useSetup(() => useWishlist());
    vm.getWishlistProducts();

    expect(vm.items).toEqual(generateTestProducts(15));
  });
});
