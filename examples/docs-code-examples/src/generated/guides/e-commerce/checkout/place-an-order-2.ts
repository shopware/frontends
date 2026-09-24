import { useOrderDetails } from "#imports";

const orderId = "example-order-id";
const {
  loadOrderDetails,
  personalDetails,
  billingAddress,
  shippingAddress,
  order,
} = useOrderDetails(orderId);

await loadOrderDetails();
