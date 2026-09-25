const { createOrder } = useCheckout();
const { refreshCart } = useCart();
// create an order
const order = await createOrder();
