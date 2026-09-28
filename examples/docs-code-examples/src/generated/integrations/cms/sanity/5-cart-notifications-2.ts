// the cart is per-user session state - load it on the client, not in cached SSR
import { onMounted, useCart } from "#imports";

const { cartItems, count, totalPrice, isEmpty, removeItem, refreshCart } =
  useCart();
onMounted(() => refreshCart());
