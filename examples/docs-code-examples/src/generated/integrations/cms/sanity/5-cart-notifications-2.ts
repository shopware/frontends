// the cart is per-user session state - load it on the client, not in cached SSR
const { cartItems, count, totalPrice, isEmpty, removeItem, refreshCart } =
  useCart();
onMounted(() => refreshCart());
