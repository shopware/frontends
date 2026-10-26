import { useAddToCart as coreUseAddToCart } from "@shopware/composables";

// composables/useAddToCart.ts
import { computed, useCart } from "#imports";
import type { Ref } from "#imports";
import type { Schemas } from "#shopware";

type Product = Schemas["Product"];
type LineItem = Schemas["LineItem"];

export function useAddToCart(product: Ref<Product | undefined>) {
  const coreFunctionality = coreUseAddToCart(product);
  const { cartItems } = useCart();

  const getQuantityInCart = computed(() => {
    return cartItems.value.find(
      (item: LineItem) => item.referencedId === product.value?.id,
    )?.quantity;
  });

  return {
    ...coreFunctionality,
    getQuantityInCart,
  };
}
