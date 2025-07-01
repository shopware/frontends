/**
 * Get payment method icon
 */
export function getPaymentMethodIcon<
  T extends {
    media?: {
      url: string;
    };
  },
>(paymentMethod: T) {
  return paymentMethod.media?.url ?? "";
}
