import { encodeForQuery } from "@shopware/api-client/helpers";
import { describe, expect, it } from "vitest";
import { ref } from "vue";

import { useSetup } from "../_test";
import { cmsAssociations } from "../cms/cmsAssociations";
import { useProductSearch } from "./useProductSearch";

describe("useProductSearch", () => {
  it("search", async () => {
    const { vm, injections } = useSetup(() => useProductSearch());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.search("test");
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readProductDetail"),
      expect.objectContaining({
        pathParams: {
          productId: "test",
        },
      }),
    );
  });

  it("search with associations", async () => {
    const { vm, injections } = useSetup(() => useProductSearch());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.search("test", {
      withCmsAssociations: true,
    });
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readProductDetail post"),
      expect.objectContaining({
        body: cmsAssociations,
        pathParams: {
          productId: "test",
        },
      }),
    );
  });

  it("uses the cacheable GET variant when cacheableReads is enabled", async () => {
    const { vm, injections } = useSetup(() => useProductSearch(), {
      shopware: { cacheableReads: true },
    });
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.search("test", {
      withCmsAssociations: true,
    });
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      "readProductDetailGet get /product/{productId}",
      {
        headers: { "sw-include-seo-urls": true, "sw-context-token": "" },
        query: {
          _criteria: encodeForQuery(cmsAssociations),
        },
        pathParams: {
          productId: "test",
        },
      },
    );
  });

  it("keeps POST for a non-default currency when cacheableReads is enabled", async () => {
    const { vm, injections } = useSetup(() => useProductSearch(), {
      shopware: { cacheableReads: true },
      swSessionContext: ref({
        salesChannel: { currencyId: "default-currency" },
        context: { currencyId: "other-currency" },
      }),
    } as Parameters<typeof useSetup>[1]);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.search("test");
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      "readProductDetail post /product/{productId}",
      {
        headers: { "sw-include-seo-urls": true },
        pathParams: { productId: "test" },
        body: { associations: {} },
      },
    );
  });
});
