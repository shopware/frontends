import { ShippingAddress } from "../../checkout/customer/ShippingAddress";
import { BillingAddress } from "../../checkout/customer/BillingAddress";
export type User = {
  activeBillingAddress?: BillingAddress;
  activeShippingAddress?: ShippingAddress;
};
