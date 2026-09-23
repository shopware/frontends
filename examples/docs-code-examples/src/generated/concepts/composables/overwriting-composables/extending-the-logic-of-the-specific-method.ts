// composables/useAddToCart.ts
import { useAddToCart as coreUseAddToCart } from "@shopware/composables";

export function useAddToCart(product: Ref<Product>) {
  const coreFunctionality = coreUseAddToCart(product);

  const addToCart = async (quantity: number) => {
    const result = await coreFunctionality.addToCart(quantity);
    // here we can call analytics, we have access to product, added quantity and result of the core addToCart method
    return result; // going back to the original method, result can also be modified by you
  };

  return {
    ...coreFunctionality,
    addToCart,
  };
}
