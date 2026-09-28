// `order` is the entity `createOrder()` resolved with above
const order = { id: "order-id" };

const {
  loadOrderDetails,
  personalDetails,
  billingAddress,
  shippingAddress,
  order: orderDetails,
} = useOrderDetails(order.id);

await loadOrderDetails();
