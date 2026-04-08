import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useSetup } from "../_test";
import ProductMocked from "../mocks/Product";
import { useAddToCart } from "./useAddToCart";

describe("useAddToCart", () => {
  vi.mock("../useCart/useCart.ts", () => ({
    useCart() {
      return {
        addProduct: () => ({}),
        cartItems: {
          value: [
            {
              referencedId: ProductMocked.id,
              good: true,
              quantity: 1,
            },
          ],
        },
      };
    },
  }));

  it("add product to cart", async () => {
    const { vm } = await useSetup(() => useAddToCart(ref(ProductMocked)));

    await vm.addToCart();
    expect(vm.quantity).toBe(1);
    expect(vm.count).toBe(1);
    expect(vm.isInCart).toBe(true);
    expect(vm.getStock).toBe(ProductMocked.stock);
    expect(vm.getAvailableStock).toBe(ProductMocked.availableStock);
  });

  it("add product to cart - empty cart", async () => {
    const { vm } = await useSetup(() => useAddToCart(ref()));
    expect(vm.count).toBe(0);
    expect(vm.isInCart).toBe(false);
    await expect(vm.addToCart()).rejects.toThrow();
  });

  it("add product to cart - product not in cart", async () => {
    const productNotInCart = { ...ProductMocked, id: "other-product-id" };
    const { vm } = await useSetup(() => useAddToCart(ref(productNotInCart)));
    expect(vm.count).toBe(0);
    expect(vm.isInCart).toBe(false);
  });

  it("add product to cart - quantity resets after add", async () => {
    const { vm } = await useSetup(() => useAddToCart(ref(ProductMocked)));
    vm.quantity = 3;
    await vm.addToCart();
    expect(vm.quantity).toBe(1);
  });
});
