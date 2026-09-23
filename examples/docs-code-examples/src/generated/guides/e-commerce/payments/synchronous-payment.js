// the cart contains at least one item added
const { createOrder } = useCheckout();

// create an order from the current Cart
const order = await createOrder(/** optional params omitted */);
// order object on success, unhandled rejection otherwise
