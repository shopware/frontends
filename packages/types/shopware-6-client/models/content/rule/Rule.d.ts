import type { PaymentMethod } from "../../checkout/payment/PaymentMethod";
import type { Promotion } from "../../checkout/promotion/Promotion";
import type { PromotionDiscount } from "../../checkout/promotion/PromotionDiscount";
import type { PromotionSetGroup } from "../../checkout/promotion/PromotionSetGroup";
import type { ShippingMethod } from "../../checkout/shipping/ShippingMethod";
import type { ShippingMethodPrice } from "../../checkout/shipping/ShippingMethodPrice";
import type { CustomFields } from "../../common/CustomField";
import type { ProductPrice } from "../product/ProductPrice";
import type { RuleCondition } from "./RuleCondition";

/**
 * @public
 */
export type Rule = {
  name: string;
  description: string | null;
  payload: string | Rule | null;
  moduleTypes: [] | null;
  productPrices: ProductPrice[];
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
  conditions: RuleCondition[];
  invalid: boolean;
  customFields: CustomFields;
  shippingMethodPrices: ShippingMethodPrice[] | null;
  promotionDiscounts: PromotionDiscount[] | null;
  promotionSetGroups: PromotionSetGroup[] | null;
  ShippingMethodPriceCalculations: ShippingMethodPrice[] | null;
  personaPromotions: Promotion[] | null;
  orderPromotions: Promotion[] | null;
  cartPromotions: Promotion[] | null;
};
