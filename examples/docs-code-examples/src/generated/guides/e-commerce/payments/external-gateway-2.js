// utilize useOrderPayment to proceed on the provided order
const { paymentUrl, handlePayment, isAsynchronous, state, paymentMethod } =
  useOrderPayment(ref(order));
