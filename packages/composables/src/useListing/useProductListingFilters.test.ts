import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import type { Schemas } from "#shopware";
import { useSetup } from "../_test";
import { useListingCore } from "./useListingCore";
import { useProductListingFilters } from "./useProductListingFilters";

const mockSearchMethod = vi.fn();

function setupWithContext(
  initialListing?: Schemas["ProductListingResult"] | null,
) {
  let childResult: ReturnType<typeof useProductListingFilters> | undefined;

  const Child = defineComponent({
    setup() {
      childResult = useProductListingFilters();
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

describe("useProductListingFilters (standalone via context)", () => {
  it("should return empty filters when no listing is set", () => {
    const { vm } = setupWithContext();

    expect(vm.getInitialFilters.value).toEqual([]);
    expect(vm.getAvailableFilters.value).toEqual([]);
    expect(vm.getCurrentFilters.value).toBeUndefined();
  });

  it("should return current filters from listing", () => {
    const listing = {
      currentFilters: {
        manufacturer: ["m1"],
        properties: ["p1"],
        search: "test",
      },
    } as unknown as Schemas["ProductListingResult"];

    const { vm } = setupWithContext(listing);

    expect(vm.getCurrentFilters.value).toEqual({
      manufacturer: ["m1"],
      properties: ["p1"],
      search: "test",
    });
  });

  it("should call search when setting filters", async () => {
    mockSearchMethod.mockResolvedValue({ elements: [] });

    const listing = {
      currentFilters: {},
    } as unknown as Schemas["ProductListingResult"];

    const { vm } = setupWithContext(listing);
    await vm.setCurrentFilters([{ code: "shipping-free", value: true }]);

    expect(mockSearchMethod).toHaveBeenCalledWith(
      expect.objectContaining({ "shipping-free": true }),
    );
  });

  it("should reset filters", async () => {
    mockSearchMethod.mockResolvedValue({ elements: [] });

    const listing = {
      currentFilters: {
        manufacturer: ["m1"],
        search: "test",
      },
    } as unknown as Schemas["ProductListingResult"];

    const { vm } = setupWithContext(listing);
    await vm.resetFilters();

    expect(mockSearchMethod).toHaveBeenCalledWith(
      expect.objectContaining({ search: "test" }),
    );
  });

  it("filtersToQuery should convert filters to query object", () => {
    const { vm } = setupWithContext();

    expect(
      vm.filtersToQuery({
        limit: 10,
        manufacturer: "m1|m2",
      } as Schemas["ProductListingCriteria"]),
    ).toEqual({
      limit: 10,
      manufacturer: "m1|m2",
    });
  });

  it("should throw when no context is available", () => {
    expect(() => useSetup(() => useProductListingFilters())).toThrowError(
      /Listing context not found/,
    );
  });
});
