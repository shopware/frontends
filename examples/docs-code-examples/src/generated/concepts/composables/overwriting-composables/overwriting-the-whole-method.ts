// composables/useAddToCart.ts
import { useAddToCart as coreUseAddToCart } from "@shopware/composables";

export function useAddToCart(product: Ref<Product>) {
  const coreFunctionality = coreUseAddToCart(product);

  const addToCart = async (quantity: number) => {
    // your own logic withoout core functionality. Mind to return the same interface as the original one and change it only if you know what you're doing
  };

  return {
    ...coreFunctionality,
    addToCart,
  };
}
