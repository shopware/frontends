import { useCart, useCheckout } from "#imports";

const { createOrder } = useCheckout();
const { refreshCart } = useCart();

const order = await createOrder();
refreshCart();
