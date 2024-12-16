import type { Rule } from "../../content/rule/Rule";
import type { Promotion } from "./Promotion";

/**
 * @public
 */
export type PromotionDiscount = {
  promotionId: string;
  scope: string;
  type: string;
  value: number;
  promotion: Promotion | null;
  discountRules: Rule[] | null;
  considerAdvancedRules: boolean;
  maxValue: number | null;
  promotionDiscountPrices: number | null;
};
