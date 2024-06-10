import { describe, expect, it } from "vitest";
import { useProductSearch } from "./useProductSearch";
import { useSetup } from "./_test";

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
});
