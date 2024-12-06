import type { Currency } from "../../system/currency/Currency";
import type { PromotionDiscount } from "./PromotionDiscount";

/**
 * @public
 */
export type PromotionDiscountPrice = {
  currencyId: string;
  discountId: string;
  price: number;
  promotionDiscount: PromotionDiscount;
  currency: Currency;
};
