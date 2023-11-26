type ShippingMethod<T = unknown> = T & {
  deliveryTime?: {
    translated: {
      name: string;
    };
  };
};

/**
 *  Get shipping delivery time
 *
 * @param {ShippingMethod} shippingMethod
 * @returns {string}
 */
export function getShippingMethodDeliveryTime(shippingMethod: ShippingMethod) {
  return shippingMethod.deliveryTime?.translated?.name;
}
