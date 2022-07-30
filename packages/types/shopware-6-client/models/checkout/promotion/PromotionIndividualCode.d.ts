import { Promotion } from "./Promotion";

/**
 * @public
 */
export type PromotionIndividualCode = {
  promotionId: string;
  code: string;
  promotion: Promotion | null;
  payload: string[] | null;
};
