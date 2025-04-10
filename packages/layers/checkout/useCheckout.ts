export function useCheckout() {
  const { cart, removeFromCart } = useCartSidebarComponent();

  function checkout() {
    cart.value.length = 0; // Clear cart after checkout
  }

  return { cart, checkout, removeFromCart };
}
