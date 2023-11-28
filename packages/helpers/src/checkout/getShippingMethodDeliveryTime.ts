/**
 *  Get shipping delivery time
 *
 * @param {ShippingMethod} shippingMethod
 * @returns {string}
 */
export function getShippingMethodDeliveryTime<
  T extends {
    deliveryTime?: {
      translated?: {
        name?: string;
      };
    };
  },
>(shippingMethod: T) {
  return shippingMethod.deliveryTime?.translated?.name;
}
