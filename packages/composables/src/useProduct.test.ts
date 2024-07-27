import { describe, expect, it } from "vitest";
import { useProduct } from "./useProduct";
import mockedProduct from "./mocks/Product";
import { useSetup } from "./_test";
import { ref } from "vue";

describe("useProduct", () => {
  it("should return product object", () => {
    const { vm } = useSetup(() => useProduct(mockedProduct));

    expect(vm.product).toStrictEqual(mockedProduct);
  });

  it("changeVariant - should merge the current product with the new variant data", () => {
    const { vm } = useSetup(() => useProduct(mockedProduct));
    expect(vm.changeVariant()).toBeUndefined();
  });

  it("changeVariant - empty", () => {
    const { vm } = useSetup(useProduct);

    vm.changeVariant(Object.assign({ ...mockedProduct }, { id: "new-id" }));
    expect(vm.product.id).toBe("new-id");
  });

  it("init without product should throw an error", () => {
    expect(() =>
      useSetup(() =>
        useProduct(
          // @ts-expect-error if API returns null we want to be prepared for it
          ref(null),
        ),
      ),
    ).toThrowError("Product context is not provided");
  });
});
