import { describe, expect, it } from "vitest";
import { useListing, useCategoryListing } from "./useListing";
import { useSetup } from "../_test";
import searchMock from "../mocks/Search";
import ContextError from "../helpers/ContextError";
import type { Schemas } from "#shopware";

describe("useListing", () => {
  it("should invoke search", async () => {
    const { vm, injections } = await useSetup(() =>
      useListing({
        listingType: "productSearchListing",
      }),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.search({
      search: "",
    });

    injections.apiClient.invoke.mockResolvedValue(searchMock);

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("search"),
      expect.objectContaining({}),
    );

    expect(vm.getCurrentPage).toBe(1);
    expect(vm.getTotalPagesCount).toBe(0);
    expect(vm.getLimit).toBe(10);
  });

  it('should invoke "readQuotes"', async () => {
    const { vm, injections } = await useSetup(() =>
      useListing({
        listingType: "categoryListing",
        categoryId: "1234",
      }),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.search({
      search: "",
    });
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readProductListing"),
      expect.objectContaining({
        body: {
          search: "",
        },
        headers: {
          "sw-include-seo-urls": true,
        },
        pathParams: {
          categoryId: "1234",
        },
      }),
    );
  });

  it("should handle context error", async () => {
    let error: unknown | null = null;
    try {
      await useSetup(() =>
        useListing({
          listingType: "categoryListing",
        }),
      );
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(new ContextError("Category"));
  });

  it("should set current filters", async () => {
    const { vm, injections } = await useSetup(() =>
      useListing({
        listingType: "categoryListing",
        categoryId: "1234",
      }),
    );

    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.setCurrentFilters({ code: "test", value: "test" });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readProductListing"),
      expect.objectContaining({
        body: {
          code: "test",
          manufacturer: undefined,
          properties: undefined,
          query: undefined,
          value: "test",
        },
        headers: {
          "sw-include-seo-urls": true,
        },
        pathParams: {
          categoryId: "1234",
        },
      }),
    );
  });

  it("filtersToQuery", async () => {
    const { vm } = await useSetup(() =>
      useListing({
        listingType: "categoryListing",
        categoryId: "1234",
      }),
    );

    expect(vm.filtersToQuery({ limit: 10, page: 1 })).toEqual({
      limit: 10,
      page: 1,
    });
  });

  it("resetFilters", async () => {
    const { vm, injections } = await useSetup(() =>
      useListing({
        listingType: "categoryListing",
        categoryId: "1234",
      }),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.resetFilters();
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readProductListing"),
      expect.objectContaining({
        body: {
          search: "",
        },
        headers: {
          "sw-include-seo-urls": true,
        },
        pathParams: {
          categoryId: "1234",
        },
      }),
    );
  });

  it("useCategoryListing - error is thrown when listingContext was not provided in parent tree", async () => {
    expect(() => useSetup(useCategoryListing)).toThrowError();
  });

  it("setInitialListing", async () => {
    const { vm } = await useSetup(() =>
      useListing({
        listingType: "categoryListing",
        categoryId: "1234",
      }),
    );

    vm.setInitialListing({
      apiAlias: "product_listing",
    } as Schemas["ProductListingResult"]);

    expect(vm.getInitialListing).toEqual({ apiAlias: "product_listing" });
  });

  it("initSearch", () => {
    const { vm, injections } = useSetup(() =>
      useListing({ listingType: "productSearchListing" }),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.initSearch({
      search: "test",
    });

    expect(vm.getCurrentPage).toBe(1);
    expect(vm.getTotalPagesCount).toBe(0);
    expect(vm.getLimit).toBe(10);
  });

  it("loadMore", async () => {
    const { vm, injections } = await useSetup(() =>
      useListing({
        listingType: "productSearchListing",
      }),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: { page: 1 } });
    await vm.loadMore();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("search"),
      expect.objectContaining({
        body: {
          p: 2,
        },
        headers: {
          "sw-include-seo-urls": true,
        },
      }),
    );
  });

  it("changeCurrentSortingOrder", async () => {
    const { vm, injections } = await useSetup(() =>
      useListing({
        listingType: "productSearchListing",
      }),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: { page: 1 } });
    vm.changeCurrentSortingOrder("test");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("search"),
      expect.objectContaining({
        body: {
          order: "test",
        },
        headers: {
          "sw-include-seo-urls": true,
        },
      }),
    );
  });

  it("changeCurrentPage", async () => {
    const { vm, injections } = await useSetup(() =>
      useListing({
        listingType: "productSearchListing",
      }),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: { page: 1 } });
    vm.changeCurrentPage(2);

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("search"),
      expect.objectContaining({
        body: {
          page: 2,
        },
        headers: {
          "sw-include-seo-urls": true,
        },
      }),
    );
  });

  it("getAvailableFilters", async () => {
    const { vm } = await useSetup(() =>
      useListing({
        listingType: "productSearchListing",
      }),
    );
    expect(vm.getAvailableFilters).toEqual([]);
  });
});
