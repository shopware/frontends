import { ShippingMethod } from "../shipping/ShippingMethod";
import { StateMachineState } from "../../system/state-machine/StateMachineState";
import { ShippingAddress } from "../customer/ShippingAddress";
import { CustomFields } from "../../common/CustomField";

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
