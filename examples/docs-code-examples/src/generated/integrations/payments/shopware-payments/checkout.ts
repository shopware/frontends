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
  cart: currentCart,
  salesChannelContext: context,
};

function placedOrderCheckout(order: object): PlacedOrderCheckout {
  return { order };
}

export { cartCheckout, placedOrderCheckout };
