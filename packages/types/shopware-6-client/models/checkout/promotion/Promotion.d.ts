import type { Rule } from "../../content/rule/Rule";
import type { TaxRule } from "../../system/tax/TaxRule";
import type { Customer } from "../customer/Customer";
import type { PromotionDiscount } from "./PromotionDiscount";
import type { PromotionIndividualCode } from "./PromotionIndividualCode";
import type { PromotionSalesChannel } from "./PromotionSalesChannel";
import type { PromotionSetGroup } from "./PromotionSetGroup";
import type { PromotionTranslation } from "./PromotionTranslation";

/**
 * @public
 */
export type Promotion = {
  name: string | null;
  active: boolean;
  validFrom: Date;
  validUntil: Date;
  maxRedemptionsGlobal: number;
  maxRedemptionsPerCustomer: number;
  exclusive: boolean;
  useCodes: boolean;
  useSetGroups: boolean;
  customerRestriction: boolean;
  useIndividualCodes: boolean;
  individualCodePattern: string;
  salesChannels: PromotionSalesChannel[] | null;
  code: string | null;
  discounts: PromotionDiscount[] | null;
  individualCodes: PromotionIndividualCode[] | null;
  setgroups: PromotionSetGroup[] | null;
  orderRules: Rule[] | null;
  personaRules: Rule[] | null;
  personaCustomers: Customer[] | null;
  cartRules: TaxRule[];
  translations: PromotionTranslation[] | null;
  orderCount: number;
  ordersPerCustomerCount: [] | null;
  exclusionIds: string[];
  apiAlias: "promotion";
};
