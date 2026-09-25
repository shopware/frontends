import { useAddToCart as coreUseAddToCart } from "@shopware/composables";

// composables/useAddToCart.ts
import type { Ref } from "#imports";
import type { Schemas } from "#shopware";

type Product = Schemas["Product"];

export function useAddToCart(product: Ref<Product | undefined>) {
  const coreFunctionality = coreUseAddToCart(product);
  return {
    ...coreFunctionality,
  };
}
