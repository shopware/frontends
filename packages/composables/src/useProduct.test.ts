import { describe, expect, it } from "vitest";
import { useProduct } from "./useProduct";
import mockedProduct from "./mocks/Product";
import { useSetup } from "./_test";

describe("useProduct", () => {
  it("should return product object", () => {
    const { vm } = useSetup(() => useProduct(mockedProduct));

    expect(vm.product).toStrictEqual(mockedProduct);
  });

  it("should return undefined configurator object", () => {
    const { vm } = useSetup(() => useProduct(mockedProduct));

    expect(vm.configurator).toBe(undefined);
  });
});
