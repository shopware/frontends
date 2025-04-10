import type { Schemas } from "@shopware/api-client/store-api-types";
import { useCart } from "@shopware/composables";

import { useCartItemComponent as useCartItemComponentBase } from "../../../packages/layers/cart/composables/useCartItemComponent";

/**
 * Custom implementation of useCartItemComponent for the Vue Blank template
 * Overrides just the emitter handlers and uses the core implementation for everything else
 */
export function useCartItemComponent(
  item: ComputedRef<Schemas["LineItem"]>,
  emit: {
    (e: "quantity-change", itemId: string, quantity: number): void;
    (e: "remove", itemId: string): void;
  },
) {
  // Get the cart API directly
  const cartApi = useCart();

  // Create custom emitter handlers that work directly with the cart API
  const customEmit = {
    "quantity-change": async (itemId: string, quantity: number) => {
      // Log the change for analytics (template specific)
      console.log(
        `Changing quantity for ${itemId} to ${quantity} in vue-blank template`,
      );

      // Use cart API directly instead of emitting
      await cartApi.changeProductQuantity({
        id: itemId,
        quantity: quantity,
      });

      // Still emit the original event for compatibility
      emit("quantity-change", itemId, quantity);
    },
    remove: async (itemId: string) => {
      // Template-specific removal logic
      console.log(`Removing item ${itemId} in vue-blank template`);

      // Use cart API directly
      await cartApi.removeItem({ id: itemId });

      // Still emit the original event for compatibility
      emit("remove", itemId);
    },
  };

  // Get all the functionality from the base component
  const baseImplementation = useCartItemComponentBase(item, emit);

  // Return the base implementation with overridden handlers
  return {
    ...baseImplementation,
    handleIncrement: () => {
      const newQuantity = item.value.quantity + 1;
      customEmit["quantity-change"](item.value.id, newQuantity);
    },
    handleDecrement: () => {
      if (item.value.quantity > 1) {
        const newQuantity = item.value.quantity - 1;
        customEmit["quantity-change"](item.value.id, newQuantity);
      }
    },
    handleRemove: () => {
      customEmit.remove(item.value.id);
    },
  };
}
