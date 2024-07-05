import { describe, expect, it } from "vitest";
import { useListing } from "./useListing";
import { useSetup } from "./_test";
import searchMock from "./mocks/Search";
import ContextError from "./helpers/ContextError";

describe("useListing", () => {
  it("invoke search", async () => {
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

  it('invoke "readQuotes"', async () => {
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

  it('invoke "readQuotes" - errors', async () => {
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

  it("setCurrentFilters", async () => {
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
});
