import type { StateMachineState } from "../../system/state-machine/StateMachineState";
import type { CalculatedPrice } from "../cart/price/CalculatedPrice";
import type { ShippingMethodPrice } from "../shipping/ShippingMethodPrice";
import type { Order } from "./Order";
import type { OrderAddress } from "./OrderAddress";
import type { OrderDeliveryPosition } from "./OrderDeliveryPosition";

/**
 * @public
 */
export type OrderDelivery = {
  orderId: string;
  shippingOrderAddressId: string;
  shippingMethodId: string;
  trackingCode: string | null;
  shippingDateEarliest: Date;
  shippingDateLatest: Date;
  shippingCosts: CalculatedPrice;
  shippingOrderAddress: OrderAddress | null;
  stateId: string;
  stateMachineState: StateMachineState | null;
  shippingMethod: ShippingMethodPrice | null;
  order: Order | null;
  positions: OrderDeliveryPosition[] | null;
};
