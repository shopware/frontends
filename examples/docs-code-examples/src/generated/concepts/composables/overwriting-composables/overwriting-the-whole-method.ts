import { useAddToCart as coreUseAddToCart } from "@shopware/composables";

// composables/useAddToCart.ts
import type { Ref } from "#imports";
import type { Schemas } from "#shopware";

type Product = Schemas["Product"];

export function useAddToCart(product: Ref<Product | undefined>) {
  const coreFunctionality = coreUseAddToCart(product);

  const addToCart = async (quantity: number) => {
    void quantity;
    // your own logic withoout core functionality. Mind to return the same interface as the original one and change it only if you know what you're doing
  };

  return {
    ...coreFunctionality,
    addToCart,
  };
}
