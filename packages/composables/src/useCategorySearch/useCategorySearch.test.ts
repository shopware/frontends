import { encodeForQuery } from "@shopware/api-client/helpers";
import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

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
      expect.stringContaining("readCategory post"),
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
      expect.stringContaining("readCategory post"),
      expect.objectContaining({
        pathParams: {
          navigationId: "categoryId",
        },
        headers: {
          "sw-include-seo-urls": true,
        },
        body: {
          associations: cmsAssociations.associations,
        },
      }),
    );
  });

  it("search uses the cacheable GET variant when cacheableReads is enabled", () => {
    const { vm, injections } = useSetup(useCategorySearch, {
      shopware: { cacheableReads: true },
    });
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
    });

    vm.search("categoryId", {
      query: {
        filter: [{ type: "equals", field: "active", value: true }],
        limit: 1,
        sort: [{ field: "name", order: "ASC" }],
      },
      withCmsAssociations: true,
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      "readCategoryGet get /category/{navigationId}",
      {
        pathParams: {
          navigationId: "categoryId",
        },
        headers: {
          "sw-include-seo-urls": true,
          "sw-context-token": "",
        },
        query: {
          _criteria: encodeForQuery({
            associations: cmsAssociations.associations,
            filter: [{ type: "equals", field: "active", value: true }],
            sort: [{ field: "name", order: "ASC" }],
          }),
          limit: 1,
        },
      },
    );
  });

  it("search sends listing params as plain query params on GET", () => {
    const { vm, injections } = useSetup(useCategorySearch, {
      shopware: { cacheableReads: true },
    });
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
    });

    vm.search("categoryId", {
      withCmsAssociations: true,
      query: {
        p: 2,
        limit: 30,
        order: "price-asc",
        properties: "a|b",
      } as Schemas["Criteria"],
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      "readCategoryGet get /category/{navigationId}",
      expect.objectContaining({
        query: {
          _criteria: encodeForQuery({ associations: cmsAssociations }),
          p: 2,
          limit: 30,
          order: "price-asc",
          properties: "a|b",
        },
      }),
    );
  });

  it("search encodes Criteria body keys into cacheable GET _criteria", () => {
    const { vm, injections } = useSetup(useCategorySearch, {
      shopware: { cacheableReads: true },
    });
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
    });

    vm.search("categoryId", {
      query: {
        aggregations: [{ type: "count", field: "id", name: "count-id" }],
        fields: ["name"],
        grouping: ["translated.name"],
        ids: ["categoryId"],
        "post-filter": [{ type: "equals", field: "active", value: true }],
      },
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      "readCategoryGet get /category/{navigationId}",
      expect.objectContaining({
        query: {
          _criteria: encodeForQuery({
            associations: {},
            aggregations: [{ type: "count", field: "id", name: "count-id" }],
            fields: ["name"],
            grouping: ["translated.name"],
            ids: ["categoryId"],
            "post-filter": [{ type: "equals", field: "active", value: true }],
          }),
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
      "readCategoryListGet get /category",
      {
        headers: { "sw-context-token": "" },
        query: {
          _criteria: encodeForQuery({
            associations: {},
            limit: 10,
          }),
        },
      },
    );
  });
});
