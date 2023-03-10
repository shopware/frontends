import { Rule } from "../../content/rule/Rule";
import { Currency } from "../../system/currency/Currency";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type ShippingMethodPrice = {
  shippingMethodId: string;
  currencyId: string;
  calculation: number | null;
  quantityStart: number | null;
  quantityEnd: number | null;
  price: number;
  shippingMethod: ShippingMethodPrice | null;
  customFields: CustomFields;
  rule: Rule | null;
  currency: Currency | null;
  calculationRuleId: string | null;
};
