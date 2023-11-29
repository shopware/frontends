import { describe, expect, it, vi } from "vitest";
import { useProductConfigurator } from "./useProductConfigurator";
import { ref, defineComponent } from "vue";
import mockedProduct from "./mocks/Product";
import mockedConfigurator from "./mocks/Configurator";
import { useSetup } from "./_test";

describe("useProductConfigurator", () => {
  vi.mock("./useProduct.ts", () => ({
    useProduct() {
      return {
        configurator: ref(mockedConfigurator),
        product: ref(mockedProduct),
      };
    },
  }));

  it("handleChange callback function was called", () => {
    const { vm } = useSetup(useProductConfigurator);
    const mockedFn = vi.fn();

    vm.handleChange("test", "test", mockedFn);
    expect(mockedFn).toHaveBeenCalled();
  });

  it("findVariantForSelectedOptions", async () => {
    const { vm, injections } = useSetup(useProductConfigurator);
    injections.apiClient.invoke.mockResolvedValue({
      elements: [mockedProduct],
    });

    expect(
      await vm.findVariantForSelectedOptions({
        test: "test",
      }),
    ).toStrictEqual(mockedProduct);

    expect(await vm.findVariantForSelectedOptions()).toStrictEqual(
      mockedProduct,
    );
  });

  it("findVariantForSelectedOptions - error", async () => {
    console.error = vi.fn();
    const { vm, injections } = useSetup(useProductConfigurator);
    injections.apiClient.invoke.mockRejectedValue("PROBLEM");

    await vm.findVariantForSelectedOptions({
      test: "test",
    });
    expect(console.error).toBeCalledWith(
      "SwProductDetails:findVariantForSelectedOptions",
      "PROBLEM",
    );
  });
});
