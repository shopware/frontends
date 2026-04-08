import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import type { Schemas } from "#shopware";
import { useSetup } from "../_test";
import { useListingCore } from "./useListingCore";
import { useProductListingPagination } from "./useProductListingPagination";

const mockSearchMethod = vi.fn();

function setupWithContext(
  initialListing?: Schemas["ProductListingResult"] | null,
) {
  let childResult: ReturnType<typeof useProductListingPagination> | undefined;

  const Child = defineComponent({
    setup() {
      childResult = useProductListingPagination();
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

describe("useProductListingPagination (standalone via context)", () => {
  it("should return page 1 and 0 total pages when no listing", () => {
    const { vm } = setupWithContext();

    expect(vm.getCurrentPage.value).toBe(1);
    expect(vm.getTotalPagesCount.value).toBe(0);
  });

  it("should compute page info from listing", () => {
    const listing = {
      page: 3,
      total: 50,
      limit: 10,
    } as Schemas["ProductListingResult"];

    const { vm } = setupWithContext(listing);

    expect(vm.getCurrentPage.value).toBe(3);
    expect(vm.getTotalPagesCount.value).toBe(5);
  });

  it("should call search with page number on changeCurrentPage", async () => {
    mockSearchMethod.mockResolvedValue({ elements: [], page: 2 });

    const { vm } = setupWithContext();
    await vm.changeCurrentPage(2);

    expect(mockSearchMethod).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 }),
    );
  });

  it("should merge additional query params in changeCurrentPage", async () => {
    mockSearchMethod.mockResolvedValue({ elements: [], page: 3 });

    const { vm } = setupWithContext();
    await vm.changeCurrentPage(3, { search: "test" });

    expect(mockSearchMethod).toHaveBeenCalledWith(
      expect.objectContaining({ page: 3, search: "test" }),
    );
  });

  it("should throw when no context is available", () => {
    expect(() => useSetup(() => useProductListingPagination())).toThrowError(
      /Listing context not found/,
    );
  });
});
