import { ShippingMethod } from "@shopware-pwa/types";

/**
 *  Get shipping delivery time
 *
 * @param {ShippingMethod} shippingMethod
 */
export function getShippingMethodDeliveryTime(shippingMethod: ShippingMethod) {
  return shippingMethod.deliveryTime?.translated?.name;
}
