import { useAddToCart as coreUseAddToCart } from "@shopware/composables";

// composables/useAddToCart.ts
import type { Ref } from "#imports";
import type { Schemas } from "#shopware";

type Product = Schemas["Product"];

export function useAddToCart(product: Ref<Product | undefined>) {
  const coreFunctionality = coreUseAddToCart(product);

  const addToCart = async (quantity: number) => {
    coreFunctionality.quantity.value = quantity;
    const result = await coreFunctionality.addToCart();
    // here we can call analytics, we have access to product, added quantity and result of the core addToCart method
    return result; // going back to the original method, result can also be modified by you
  };

  return {
    ...coreFunctionality,
    addToCart,
  };
}
