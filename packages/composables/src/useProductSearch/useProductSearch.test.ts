import { describe, expect, it } from "vitest";
import { useProductSearch } from "./useProductSearch";
import { useSetup } from "../_test";
import { cmsAssociations } from "../cms/cmsAssociations";

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
      expect.stringContaining("readProductDetail"),
      expect.objectContaining({
        body: cmsAssociations,
        pathParams: {
          productId: "test",
        },
      }),
    );
  });
});
