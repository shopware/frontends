import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import type { Schemas } from "#shopware";
import { useSetup } from "../_test";
import { useListingCore, useListingCoreContext } from "./useListingCore";

const mockSearchMethod = vi.fn();

function setupListingCore(
  initialListing?: Schemas["ProductListingResult"] | null,
) {
  return useSetup(() =>
    useListingCore({
      listingKey: "testListing",
      searchMethod: mockSearchMethod,
      searchDefaults: {},
      initialListing,
    }),
  );
}

describe("useListingCore", () => {
  it("should initialize with null listing when no initialListing provided", () => {
    const { vm } = setupListingCore();

    expect(vm.getInitialListing).toBeNull();
    expect(vm.getCurrentListing).toBeNull();
    expect(vm.getElements).toEqual([]);
    expect(vm.getTotal).toBe(0);
    expect(vm.getLimit).toBe(10);
  });

  it("should initialize with provided initialListing", () => {
    const mockListing = {
      elements: [{ id: "p1" }],
      total: 5,
      limit: 20,
      page: 1,
    } as Schemas["ProductListingResult"];

    const { vm } = setupListingCore(mockListing);

    expect(vm.getInitialListing).toEqual(mockListing);
    expect(vm.getCurrentListing).toEqual(mockListing);
    expect(vm.getElements).toEqual([{ id: "p1" }]);
    expect(vm.getTotal).toBe(5);
    expect(vm.getLimit).toBe(20);
  });

  it("should set initial listing", async () => {
    const { vm } = setupListingCore();
    const newListing = {
      elements: [{ id: "p2" }],
      total: 3,
    } as Schemas["ProductListingResult"];

    await vm.setInitialListing(newListing);

    expect(vm.getInitialListing).toEqual(newListing);
  });

  it("should search and update applied listing", async () => {
    const result = {
      elements: [{ id: "p3" }],
      total: 1,
      page: 1,
    } as Schemas["ProductListingResult"];
    mockSearchMethod.mockResolvedValue(result);

    const { vm } = setupListingCore();
    await vm.search({ search: "test" });

    expect(vm.getCurrentListing).toEqual(result);
    expect(vm.loading).toBe(false);
  });

  it("should loadMore and append elements", async () => {
    const initialListing = {
      elements: [{ id: "p1" }],
      total: 3,
      page: 1,
    } as Schemas["ProductListingResult"];

    const moreResult = {
      elements: [{ id: "p2" }],
      page: 2,
    } as Schemas["ProductListingResult"];
    mockSearchMethod.mockResolvedValue(moreResult);

    const { vm } = setupListingCore(initialListing);
    await vm.loadMore();

    expect(vm.getCurrentListing?.elements).toHaveLength(2);
    expect(vm.getCurrentListing?.page).toBe(2);
    expect(vm.loadingMore).toBe(false);
  });

  it("initSearch should return result without updating applied listing", async () => {
    const result = {
      elements: [{ id: "p5" }],
      total: 1,
    } as Schemas["ProductListingResult"];
    mockSearchMethod.mockResolvedValue(result);

    const { vm } = setupListingCore();
    const returned = await vm.initSearch({ search: "test" });

    expect(returned).toEqual(result);
    expect(vm.getCurrentListing).toBeNull();
  });
});

describe("useListingCoreContext", () => {
  it("should throw when no context is provided", () => {
    expect(() => useSetup(() => useListingCoreContext())).toThrowError(
      /Listing context not found/,
    );
  });

  it("should return context when provided by parent component", () => {
    let childResult: ReturnType<typeof useListingCoreContext> | undefined;

    const Child = defineComponent({
      setup() {
        childResult = useListingCoreContext();
        return {};
      },
      render: () => h("span"),
    });

    const Parent = defineComponent({
      setup() {
        useListingCore({
          listingKey: "testListing",
          searchMethod: mockSearchMethod,
          searchDefaults: {},
        });
      },
      render: () => h(Child),
    });

    mount(Parent, {
      global: {
        provide: {
          shopware: {},
          apiClient: { invoke: vi.fn() },
        },
      },
    });

    expect(childResult).toBeDefined();
    expect(childResult?.getCurrentListing.value).toBeNull();
    expect(childResult?.getElements.value).toEqual([]);
  });
});
