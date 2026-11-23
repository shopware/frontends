import type { CartCheckout, PlacedOrderCheckout } from "./snippet-context";

// The library keeps this object and reads both getters again on each click.
// `cart` is the Store API cart (prices, line items, deliveries).
// `salesChannelContext` is the Store API context (currency, customer, sales channel).
function cartCheckout(cart: object, salesChannelContext: object): CartCheckout {
  return {
    get cart() {
      return cart;
    },
    get salesChannelContext() {
      return salesChannelContext;
    },
  };
}

// `order` is the Store API order. Pass this shape instead of the cart.
function placedOrderCheckout(order: object): PlacedOrderCheckout {
  return { order };
}

export { cartCheckout, placedOrderCheckout };
