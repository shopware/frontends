import { useCart, useSessionContext } from "#imports";

import type { CartCheckout, PlacedOrderCheckout } from "./snippet-context";

const { cart, refreshCart } = useCart();
const { sessionContext } = useSessionContext();

const currentCart = cart.value ?? (await refreshCart());
const context = sessionContext.value;

if (!currentCart || !context) {
  throw new Error("Cart and session are required before rendering payment UI");
}

const cartCheckout: CartCheckout = {
  // The library keeps this object and reads these fields again on each click.
  get cart() {
    return cart.value ?? currentCart;
  },
  get salesChannelContext() {
    return sessionContext.value ?? context;
  },
};

function placedOrderCheckout(order: object): PlacedOrderCheckout {
  return { order };
}

export { cartCheckout, placedOrderCheckout };
