import type { CustomFields } from "../../common/CustomField";
import type { StateMachineState } from "../../system/state-machine/StateMachineState";
import type { ShippingAddress } from "../customer/ShippingAddress";
import type { ShippingMethod } from "../shipping/ShippingMethod";

/**
 * @public
 */
export type Delivery = {
  apiAlias: string;
  createdAt: string;
  customFields: CustomFields;
  extensions: unknown;
  id: string;
  orderId: string;
  orderVersionId: string;
  positions: unknown | null;
  shippingCosts: {
    unitPrice: number;
    quantity: number;
    listPrice: number | null;
    apiAlias: string;
  };
  shippingDateEarliest: string;
  shippingDateLatest: string;
  shippingMethod: ShippingMethod;
  shippingMethodId: string;
  shippingOrderAddress: ShippingAddress;
  shippingOrderAddressId: string;
  shippingOrderAddressVersionId: string;
  stateId: string;
  stateMachineState: StateMachineState;
  trackingCodes: unknown[];
  translated: unknown[];
  updatedAt: Date | string | null;
  versionId: string;
  _uniqueIdentifier: string;
};
