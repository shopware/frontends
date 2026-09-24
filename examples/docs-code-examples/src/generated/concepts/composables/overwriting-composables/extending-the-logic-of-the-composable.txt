import { useAddToCart as coreUseAddToCart } from "@shopware/composables";

// composables/useAddToCart.ts
import { Ref, computed, useCart } from "#imports";

export function useAddToCart(product: Ref<Product>) {
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
