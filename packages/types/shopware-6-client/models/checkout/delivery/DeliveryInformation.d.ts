import type { DeliveryTime } from "./DeliveryTime";

/**
 * @public
 */
export type DeliveryInformation = {
  stock: number;
  weight: number;
  freeDelivery: boolean;
  restockTime: number | null;
  deliveryTime: DeliveryTime | null;
};
