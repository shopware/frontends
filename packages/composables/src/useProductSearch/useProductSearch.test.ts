import { encodeForQuery } from "@shopware/api-client/helpers";
import { describe, expect, it } from "vitest";

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
      expect.stringContaining("readProductDetailGet get"),
      expect.objectContaining({
        query: {
          _criteria: encodeForQuery(cmsAssociations),
        },
        pathParams: {
          productId: "test",
        },
      }),
    );
  });
});
