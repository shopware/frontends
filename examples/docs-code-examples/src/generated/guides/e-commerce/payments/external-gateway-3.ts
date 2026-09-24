// where to redirect an user when payment is done correctly
const SUCCESS_PAYMENT_URL: string = `${window?.location?.origin}/checkout/success/${orderId}/paid`;
// go to this page otherwise
const FAILURE_PAYMENT_URL: string = `${window?.location?.origin}/checkout/success/${orderId}/unpaid`;

const handlePaymentResponse = await handlePayment(
  SUCCESS_PAYMENT_URL,
  FAILURE_PAYMENT_URL,
  {
    /**
     * here goes additional information required by payment provider
     * can be payment intent token
     */
  },
);
