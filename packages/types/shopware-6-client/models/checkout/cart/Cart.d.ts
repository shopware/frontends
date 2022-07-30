import { LineItem } from "./line-item/LineItem";
import { CartPrice } from "./price/CartPrice";
import { Delivery } from "../delivery/Delivery";
import { Transaction } from "./transaction/Transaction";
import { EntityError } from "../../common/EntityError";

/**
 * @beta
 */
export type CartErrors = {
  [key: string]: EntityError;
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
  affiliateCode: null | string;
  campaignCode: null | string;
};
