import { encodeForQuery } from "@shopware/api-client/helpers";
import { describe, expect, it } from "vitest";

import { useSetup } from "../_test";
import { cmsAssociations } from "../cms/cmsAssociations";
import { useCategorySearch } from "./useCategorySearch";

describe("useCategorySearch", () => {
  it("search method", () => {
    const { vm, injections } = useSetup(useCategorySearch);
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
    });
    vm.search("categoryId");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readCategory"),
      expect.objectContaining({
        pathParams: {
          navigationId: "categoryId",
        },
        headers: {
          "sw-include-seo-urls": true,
        },
      }),
    );
  });

  it("search method - with cms associations ", () => {
    const { vm, injections } = useSetup(useCategorySearch);
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
    });
    vm.search("categoryId", {
      withCmsAssociations: true,
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readCategory"),
      expect.objectContaining({
        pathParams: {
          navigationId: "categoryId",
        },
        headers: {
          "sw-include-seo-urls": true,
        },
        body: {
          associations: cmsAssociations,
        },
      }),
    );
  });

  it("advanced search method", () => {
    const { vm, injections } = useSetup(useCategorySearch);
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
    });

    vm.advancedSearch({
      query: {
        limit: 10,
      },
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readCategoryList"),
      expect.objectContaining({
        body: {
          associations: {},
          limit: 10,
        },
      }),
    );
  });

  it("advanced search method - with Cms Associations", () => {
    const { vm, injections } = useSetup(useCategorySearch);
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
    });

    vm.advancedSearch({
      query: {
        limit: 10,
      },
      withCmsAssociations: true,
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readCategoryList"),
      expect.objectContaining({
        body: {
          ...cmsAssociations,
          limit: 10,
        },
      }),
    );
  });

  it("advancedSearch uses the cacheable GET variant when cacheableReads is enabled", () => {
    const { vm, injections } = useSetup(useCategorySearch, {
      shopware: { cacheableReads: true },
    });
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
    });

    vm.advancedSearch({
      query: {
        limit: 10,
      },
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readCategoryListGet get"),
      expect.objectContaining({
        query: {
          _criteria: encodeForQuery({
            associations: {},
            limit: 10,
          }),
        },
      }),
    );
  });
});
