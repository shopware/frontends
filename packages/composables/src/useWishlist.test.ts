import { describe, expect, it, vi } from "vitest";
import { useWishlist } from "./useWishlist";
import { useSyncWishlist } from "./useSyncWishlist";
import { useUser } from "./useUser";
import { useSetup } from "./_test";
import { computed, ref } from "vue";
import type { Schemas } from "#shopware";

const getMockedUser = (
  isLoggedIn: boolean,
  isGuestSession: boolean,
  canSyncWishlist: boolean,
) =>
  ({
    isLoggedIn: ref(isLoggedIn),
    isGuestSession: ref(isGuestSession),
    canSyncWishlist: ref(canSyncWishlist),
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
  it("mergeWishlistProducts", () => {
    vi.mocked(useUser).mockReturnValue(getMockedUser(false, true, false));
    vi.mocked(useSyncWishlist).mockReturnValue({
      getWishlistProducts: () => undefined,
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
    expect(vm.getTotalPagesCount).toBe(2);
  });

  it("getWishlistProducts", async () => {
    vi.mocked(useUser).mockReturnValue(getMockedUser(false, true, false));
    vi.mocked(useSyncWishlist).mockReturnValue({
      getWishlistProducts: () => undefined,
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
    } as Schemas["Criteria"];
    vm.changeCurrentPage(2, query);

    expect(vm.getCurrentPage).toBe(2);
  });
});

describe("useWishlist - logged in user", () => {
  it("mergeWishlistProducts", () => {
    vi.mocked(useUser).mockReturnValue(getMockedUser(true, false, true));
    vi.mocked(useSyncWishlist).mockReturnValue({
      getWishlistProducts: () => undefined,
      items: computed((): string[] => {
        return ["local-testId333"];
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

    expect(vm.items.length).toBe(1);
    expect(vm.count).toBe(15);
  });

  it("getWishlistProducts", () => {
    vi.mocked(useUser).mockReturnValue(getMockedUser(true, false, true));
    const { vm } = useSetup(() => useWishlist());
    vm.getWishlistProducts();

    expect(vm.items).toEqual(["local-testId333"]);
  });
});
