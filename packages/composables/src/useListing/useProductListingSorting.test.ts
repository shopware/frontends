import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import type { Schemas } from "#shopware";
import { useSetup } from "../_test";
import { useListingCore } from "./useListingCore";
import { useProductListingSorting } from "./useProductListingSorting";

const mockSearchMethod = vi.fn();

function setupWithContext(
  initialListing?: Schemas["ProductListingResult"] | null,
) {
  let childResult: ReturnType<typeof useProductListingSorting> | undefined;

  const Child = defineComponent({
    setup() {
      childResult = useProductListingSorting();
      return childResult;
    },
    render: () => h("span"),
  });

  const Parent = defineComponent({
    setup() {
      useListingCore({
        listingKey: "testListing",
        searchMethod: mockSearchMethod,
        searchDefaults: {},
        initialListing,
      });
    },
    render: () => h(Child),
  });

  const wrapper = mount(Parent, {
    global: {
      provide: {
        shopware: {},
        apiClient: { invoke: vi.fn() },
      },
    },
  });

  if (!childResult) throw new Error("Child component did not initialize");
  return { vm: childResult, wrapper };
}

describe("useProductListingSorting (standalone via context)", () => {
  it("should return undefined sorting when no listing", () => {
    const { vm } = setupWithContext();

    expect(vm.getSortingOrders.value).toBeUndefined();
    expect(vm.getCurrentSortingOrder.value).toBeUndefined();
  });

  it("should return sorting from listing", () => {
    const listing = {
      sorting: "price-asc",
      availableSortings: [
        { key: "price-asc", label: "Price ascending" },
        { key: "name-asc", label: "Name ascending" },
      ],
    } as unknown as Schemas["ProductListingResult"];

    const { vm } = setupWithContext(listing);

    expect(vm.getCurrentSortingOrder.value).toBe("price-asc");
    expect(vm.getSortingOrders.value).toHaveLength(2);
  });

  it("should call search with order on changeCurrentSortingOrder", async () => {
    mockSearchMethod.mockResolvedValue({ elements: [] });

    const { vm } = setupWithContext();
    await vm.changeCurrentSortingOrder("name-desc");

    expect(mockSearchMethod).toHaveBeenCalledWith(
      expect.objectContaining({ order: "name-desc" }),
    );
  });

  it("should merge additional query params in changeCurrentSortingOrder", async () => {
    mockSearchMethod.mockResolvedValue({ elements: [] });

    const { vm } = setupWithContext();
    await vm.changeCurrentSortingOrder("price-asc", { search: "test" });

    expect(mockSearchMethod).toHaveBeenCalledWith(
      expect.objectContaining({ order: "price-asc", search: "test" }),
    );
  });

  it("should throw when no context is available", () => {
    expect(() => useSetup(() => useProductListingSorting())).toThrowError(
      /Listing context not found/,
    );
  });
});
