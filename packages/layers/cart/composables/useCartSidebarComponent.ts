import { computed, readonly, ref } from "vue";
import type { DeepReadonly, Ref } from "vue";
import { useNuxtApp } from "#app";

// Define the shape of the cart sidebar context
interface CartSidebarContext {
  // Sidebar state
  isOpen: DeepReadonly<Ref<boolean>>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Cart data
  cartItemCount: Ref<number>;
  cart: any; // Using any for simplicity, you may want to type this properly
  items: Ref<any[]>;
  subtotal: Ref<number>;
  shipping: Ref<number>;
  total: Ref<number>;
  isEmpty: Ref<boolean>;

  // Actions
  refreshCart: () => Promise<void>;
  handleQuantityChange: (itemId: string, quantity: number) => Promise<void>;
  handleRemoveItem: (itemId: string) => Promise<void>;
}

/**
 * Provides cart sidebar state and cart operations by utilizing the cartSidebar plugin
 * @returns The cart sidebar state, data, and methods
 */
export function useCartSidebarComponent(): CartSidebarContext {
  const { $cartSidebar } = useNuxtApp();

  // Get cart functionality from Shopware
  const cartApi = useCart();

  onMounted(() => {
    cartApi.refreshCart();
  });

  // Cart data computed properties
  const cartItemCount = computed(() => cartApi.count.value || 0);
  const items = computed(() => cartApi.cart.value?.lineItems || []);
  const subtotal = computed(() => cartApi.cart.value?.price?.subtotal || 0);
  const shipping = computed(() => 0);
  const total = computed(() => cartApi.cart.value?.price?.totalPrice || 0);
  const isEmpty = computed(() => !items.value.length);

  const cartSidebarContext: CartSidebarContext = {
    // Use the plugin's sidebar state and methods
    isOpen: $cartSidebar.isOpen,
    openCart: $cartSidebar.openCart,
    closeCart: $cartSidebar.closeCart,
    toggleCart: $cartSidebar.toggleCart,

    // Cart data
    cartItemCount,
    cart: cartApi.cart,
    items,
    subtotal,
    shipping,
    total,
    isEmpty,

    // Actions
    refreshCart: cartApi.refreshCart,
    // Use cart API directly for cart operations
    handleQuantityChange: async (itemId: string, quantity: number) => {
      await cartApi.changeProductQuantity({
        id: itemId,
        quantity: quantity,
      });
    },
    handleRemoveItem: async (itemId: string) => {
      await cartApi.removeItem({ id: itemId });
    },
  };

  return cartSidebarContext;
}
