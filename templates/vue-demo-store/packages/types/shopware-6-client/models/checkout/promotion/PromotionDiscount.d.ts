import { Rule } from "../../content/rule/Rule";
import { Promotion } from "./Promotion";

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
