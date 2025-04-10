import { useCart } from "@shopware/composables";
import { computed, reactive, readonly } from "vue";
import { defineNuxtPlugin } from "#app";

/**
 * Nuxt plugin that provides cart sidebar functionality
 * globally through the Nuxt app instance
 */
export default defineNuxtPlugin((nuxtApp) => {
  // State management
  const state = reactive({
    isOpen: false,
  });

  // Get cart functionality from Shopware
  //const cartApi = useCart();

  // Sidebar methods
  const openCart = () => {
    state.isOpen = true;
  };

  const closeCart = () => {
    state.isOpen = false;
  };

  const toggleCart = () => {
    state.isOpen = !state.isOpen;
  };

  // Cart operations
  const handleQuantityChange = async (itemId: string, quantity: number) => {
    // await cartApi.changeProductQuantity({
    //   id: itemId,
    //   quantity: quantity,
    // });
  };

  const handleRemoveItem = async (itemId: string) => {
    //await cartApi.removeItem({ id: itemId });
  };

  // Create cart sidebar object
  const cartSidebar = {
    // Sidebar state
    isOpen: computed(() => state.isOpen),
    openCart,
    closeCart,
    toggleCart,

    handleQuantityChange,
    handleRemoveItem,
  };

  // Add cart sidebar to the Nuxt app instance
  //nuxtApp.provide('cartSidebar', cartSidebar);

  // Register global event listeners
  // For example, close cart on route change
  nuxtApp.hook("page:finish", () => {
    // closeCart();
  });

  return {
    provide: {
      cartSidebar,
    },
  };
});
