import type { CustomFields } from "../../common/CustomField";
import type { Rule } from "../../content/rule/Rule";
import type { Currency } from "../../system/currency/Currency";

/**
 * @public
 */
export type ShippingMethodPrice = {
  id: string;
  shippingMethodId: string;
  calculation: number | null;
  quantityStart: number | null;
  quantityEnd: number | null;
  price?: number;
  shippingMethod?: ShippingMethodPrice | null;
  customFields: CustomFields | null;
  rule?: Rule | null;
  currency?: Currency | null;
  calculationRuleId: string | null;
  translated: [];
  createdAt: Date | string;
  updatedAt: Date | string | null;
  ruleId: string | null;
  currencyPrice: CurrencyPriceShippingMethodPrice[];
  apiAlias: "shipping_method_price";
};

export type CurrencyPriceShippingMethodPrice = {
  currencyId: string;
  net: number;
  gross: number;
  linked: boolean;
  listPrice: unknown;
  percentage: number | null;
  regulationPrice: unknown;
  apiAlias: "price";
};
