import { describe, expect, it } from "vitest";
import type { Schemas } from "#shopware";
import { useSetup } from "../_test";
import { useListing } from "./useListing";

/**
 * Integration tests for the new modular listing composables.
 * These test the interaction between useListingCore, useProductListingProducts,
 * useProductListingPagination, useProductListingSorting, and useProductListingFilters.
 */
describe("useListing integration tests", () => {
  const mockListing = {
    apiAlias: "product_listing",
    elements: [
      {
        id: "product-1",
        name: "Test Product",
      } as Schemas["Product"],
    ],
    page: 1,
    limit: 10,
    total: 25,
    availableSortings: [
      {
        apiAlias: "product_sorting",
        key: "name-asc",
        label: "Name A-Z",
        priority: 1,
        translated: { key: "name-asc", label: "Name A-Z" },
      } as Schemas["ProductSorting"],
    ],
    sorting: "name-asc",
    currentFilters: {
      manufacturer: [],
      properties: [],
      price: { min: 0, max: 0 },
      rating: null,
      "shipping-free": false,
      search: "",
      navigationId: "test",
    },
    aggregations: [],
  } as unknown as Schemas["ProductListingResult"];

  describe("Core state management", () => {
    it("should initialize with initial listing", async () => {
      const { vm } = await useSetup(() =>
        useListing({
          listingType: "productSearchListing",
          initialListing: mockListing,
        }),
      );

      expect(vm.getInitialListing).toEqual(mockListing);
      expect(vm.getCurrentListing).toEqual(mockListing);
      expect(vm.getElements).toEqual(mockListing.elements);
      expect(vm.getTotal).toBe(25);
    });

    it("should set loading state during search", async () => {
      const { vm, injections } = await useSetup(() =>
        useListing({
          listingType: "productSearchListing",
        }),
      );

      injections.apiClient.invoke.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: mockListing }), 50);
          }),
      );

      const searchPromise = vm.search({ search: "test" });

      // Loading should be true during search
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(vm.loading).toBe(true);

      await searchPromise;
      expect(vm.loading).toBe(false);
    });

    it("should update appliedListing after successful search", async () => {
      const { vm, injections } = await useSetup(() =>
        useListing({
          listingType: "productSearchListing",
          initialListing: mockListing,
        }),
      );

      const newListing = { ...mockListing, total: 50 };
      injections.apiClient.invoke.mockResolvedValue({ data: newListing });

      await vm.search({ search: "shoes" });

      expect(vm.getCurrentListing).toEqual(newListing);
      expect(vm.getTotal).toBe(50);
    });
  });

  describe("Pagination", () => {
    it("should calculate total pages correctly", async () => {
      const { vm } = await useSetup(() =>
        useListing({
          listingType: "productSearchListing",
          initialListing: mockListing,
        }),
      );

      expect(vm.getCurrentPage).toBe(1);
      expect(vm.getTotalPagesCount).toBe(3); // ceil(25 / 10) = 3
      expect(vm.getLimit).toBe(10);
    });

    it("should change page and trigger search", async () => {
      const { vm, injections } = await useSetup(() =>
        useListing({
          listingType: "productSearchListing",
        }),
      );

      injections.apiClient.invoke.mockResolvedValue({ data: mockListing });

      await vm.changeCurrentPage(2);

      expect(injections.apiClient.invoke).toHaveBeenCalledWith(
        expect.stringContaining("search"),
        expect.objectContaining({
          body: expect.objectContaining({
            p: 2,
          }),
        }),
      );
    });
  });

  describe("Sorting", () => {
    it("should return available sorting orders", async () => {
      const { vm } = await useSetup(() =>
        useListing({
          listingType: "productSearchListing",
          initialListing: mockListing,
        }),
      );

      expect(vm.getSortingOrders).toEqual(mockListing.availableSortings);
      expect(vm.getCurrentSortingOrder).toBe("name-asc");
    });

    it("should change sorting order and trigger search", async () => {
      const { vm, injections } = await useSetup(() =>
        useListing({
          listingType: "productSearchListing",
        }),
      );

      injections.apiClient.invoke.mockResolvedValue({ data: mockListing });

      await vm.changeCurrentSortingOrder("price-asc");

      expect(injections.apiClient.invoke).toHaveBeenCalledWith(
        expect.stringContaining("search"),
        expect.objectContaining({
          body: expect.objectContaining({
            order: "price-asc",
          }),
        }),
      );
    });
  });

  describe("Filters", () => {
    it("should return empty filters when no aggregations", async () => {
      const { vm } = await useSetup(() =>
        useListing({
          listingType: "productSearchListing",
          initialListing: mockListing,
        }),
      );

      // mockListing has empty aggregations array
      expect(vm.getInitialFilters).toEqual([]);
    });

    it("should set filters and trigger search", async () => {
      const { vm, injections } = await useSetup(() =>
        useListing({
          listingType: "productSearchListing",
          initialListing: mockListing,
        }),
      );

      injections.apiClient.invoke.mockResolvedValue({ data: mockListing });

      await vm.setCurrentFilters([
        { code: "manufacturer", value: "brand-1" },
        { code: "shipping-free", value: true },
      ]);

      expect(injections.apiClient.invoke).toHaveBeenCalledWith(
        expect.stringContaining("search"),
        expect.objectContaining({
          body: expect.objectContaining({
            manufacturer: expect.anything(),
            "shipping-free": true,
          }),
        }),
      );
    });

    it("should reset filters", async () => {
      const { vm, injections } = await useSetup(() =>
        useListing({
          listingType: "productSearchListing",
          initialListing: mockListing,
        }),
      );

      injections.apiClient.invoke.mockResolvedValue({ data: mockListing });

      await vm.resetFilters();

      expect(injections.apiClient.invoke).toHaveBeenCalledWith(
        expect.stringContaining("search"),
        expect.objectContaining({
          body: expect.objectContaining({
            search: "",
          }),
        }),
      );
    });
  });

  describe("Error handling", () => {
    it("should reset loading state on search error", async () => {
      const { vm, injections } = await useSetup(() =>
        useListing({
          listingType: "productSearchListing",
        }),
      );

      injections.apiClient.invoke.mockRejectedValue(new Error("Network error"));

      try {
        await vm.search({ search: "test" });
      } catch (error) {
        // Expected error
      }

      expect(vm.loading).toBe(false);
    });

    it("should reset loadingMore state on loadMore error", async () => {
      const { vm, injections } = await useSetup(() =>
        useListing({
          listingType: "productSearchListing",
          initialListing: mockListing,
        }),
      );

      injections.apiClient.invoke.mockRejectedValue(new Error("Network error"));

      try {
        await vm.loadMore();
      } catch (error) {
        // Expected error
      }

      expect(vm.loadingMore).toBe(false);
    });
  });

  describe("LoadMore functionality", () => {
    it("should append elements when loading more", async () => {
      const { vm, injections } = await useSetup(() =>
        useListing({
          listingType: "productSearchListing",
          initialListing: mockListing,
        }),
      );

      const page2Elements = [
        {
          id: "product-2",
          name: "Product 2",
        } as Schemas["Product"],
      ];

      const page2Listing = {
        ...mockListing,
        page: 2,
        elements: page2Elements,
      };

      injections.apiClient.invoke.mockResolvedValue({ data: page2Listing });

      await vm.loadMore();

      expect(vm.getCurrentListing?.elements).toHaveLength(2);
      expect(vm.getCurrentListing?.elements?.[1]?.id).toBe("product-2");
    });

    it("should set loadingMore flag during loadMore", async () => {
      const { vm, injections } = await useSetup(() =>
        useListing({
          listingType: "productSearchListing",
          initialListing: mockListing,
        }),
      );

      injections.apiClient.invoke.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: mockListing }), 50);
          }),
      );

      const loadMorePromise = vm.loadMore();

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(vm.loadingMore).toBe(true);

      await loadMorePromise;
      expect(vm.loadingMore).toBe(false);
    });
  });
});
