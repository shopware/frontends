/**
 *  Get shipping delivery time
 *
 */
export function getShippingMethodDeliveryTime<
  T extends {
    deliveryTime?: {
      translated: {
        name: string;
      };
    };
  },
>(shippingMethod: T) {
  return shippingMethod.deliveryTime?.translated.name;
}
