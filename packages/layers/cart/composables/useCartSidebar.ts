import type { DeepReadonly } from "vue";

// Define the shape of the cart sidebar context
interface CartSidebarContext {
  isOpen: DeepReadonly<Ref<boolean>>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

// Symbol to ensure type safety and avoid naming conflicts
const CART_SIDEBAR_SYMBOL = Symbol("cart-sidebar");

/**
 * Creates and provides the cart sidebar state to all descendant components
 * @returns The cart sidebar state and methods
 */
export function provideCartSidebar(): CartSidebarContext {
  const isOpen = ref<boolean>(false);

  const openCart = (): void => {
    isOpen.value = true;
  };

  const closeCart = (): void => {
    isOpen.value = false;
  };

  const toggleCart = (): void => {
    isOpen.value = !isOpen.value;
  };

  const cartSidebarContext: CartSidebarContext = {
    isOpen: readonly(isOpen),
    openCart,
    closeCart,
    toggleCart,
  };

  provide(CART_SIDEBAR_SYMBOL, cartSidebarContext);

  return cartSidebarContext;
}

/**
 * Accesses the cart sidebar state and methods provided by an ancestor component
 * @throws Error if used outside of a component tree where provideCartSidebar has been called
 * @returns The cart sidebar state and methods
 */
export function useCartSidebar(): CartSidebarContext {
  const cartSidebar = inject<CartSidebarContext | undefined>(
    CART_SIDEBAR_SYMBOL,
    undefined,
  );

  if (!cartSidebar) {
    throw new Error(
      "useCartSidebar() must be used within a component that has called provideCartSidebar()",
    );
  }

  return cartSidebar;
}
