import { EntityError } from "../../common/EntityError";
import type { Delivery } from "../delivery/Delivery";
import type { LineItem } from "./line-item/LineItem";
import type { CartPrice } from "./price/CartPrice";
import type { Transaction } from "./transaction/Transaction";

/**
 * @beta
 */
export type CartErrors = {
  [key: string]: CartError;
};

export type CartError = {
  code: number;
  key: string;
  level: number;
  message: string;
  messageKey: string;
};

/**
 * @public
 */
export type CartDelivery = Delivery & {
  shippingCosts: {
    unitPrice: number;
    quantity: number;
    listPrice: number | null;
    apiAlias: string;
    totalPrice: number;
  };
};

/**
 * @public
 */
export type Cart = {
  name: string;
  token: string;
  price: CartPrice;
  lineItems: LineItem[];
  errors: CartErrors;
  deliveries: CartDelivery[];
  transactions: Transaction[];
  modified: boolean;
  customerComment: null | string;
  affiliateCode?: string;
  campaignCode?: string;
};
