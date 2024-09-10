import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useAddToCart } from "./useAddToCart";
import { useSetup } from "../_test";
import ProductMocked from "../mocks/Product";

describe("useB2bQuoteManagement", () => {
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
  });

  it("add product to cart - empty cart", async () => {
    const { vm } = await useSetup(() => useAddToCart(ref()));
    expect(vm.count).toBe(0);
    await expect(vm.addToCart()).rejects.toThrow();
  });
});
