import { describe, expect, it, vi } from "vitest";
import { useProductConfigurator } from "./useProductConfigurator";
import { ref } from "vue";
import mockedProduct from "../mocks/Product";
import mockedConfigurator from "../mocks/Configurator";
import { useSetup } from "../_test";
import { useProduct } from "../useProduct/useProduct";

vi.mock("../useProduct/useProduct.ts");

describe("useProductConfigurator", () => {
  vi.mocked(useProduct).mockReturnValue({
    configurator: ref(mockedConfigurator),
    product: ref(mockedProduct),
  } as unknown as ReturnType<typeof useProduct>);

  it("handleChange callback function was called", () => {
    const { vm } = useSetup(useProductConfigurator);
    const mockedFn = vi.fn();

    vm.handleChange("test", "test", mockedFn);
    expect(mockedFn).toHaveBeenCalled();
  });

  it("findVariantForSelectedOptions", async () => {
    const { vm, injections } = useSetup(useProductConfigurator);
    injections.apiClient.invoke.mockResolvedValue({
      data: {
        elements: [mockedProduct],
      },
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

  it("product - with options", () => {
    vi.mocked(useProduct).mockReturnValue({
      configurator: ref(null),
      product: ref({
        options: [
          {
            id: "cc02c6cf39ad43d5856a25f8928490bf",
          },
          {
            id: "aa02c6cf39ad43d5856a25f8928490bf",
          },
        ],
      }),
    } as unknown as ReturnType<typeof useProduct>);

    const { vm } = useSetup(useProductConfigurator);

    expect(vm.isLoadingOptions).toBe(true);
    expect(vm.getOptionGroups).toStrictEqual([]);
  });
});
