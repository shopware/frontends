/**
 * Get shipping method icon
 */
export function getShippingMethodIcon<
  T extends {
    media?: {
      url: string;
    };
  },
>(shippingMethod: T) {
  return shippingMethod.media?.url ?? "";
}
