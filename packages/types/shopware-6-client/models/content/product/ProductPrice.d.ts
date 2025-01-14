import type { CustomFields } from "../../common/CustomField";
import type { Rule } from "../rule/Rule";
import type { Product } from "./Product";

/**
 * @public
 */
export type ProductPrice = {
  productId: number;
  quantityStart: number;
  quantityEnd: number | null;
  product: Product | null;
  rule: Rule | null;
  customFields: CustomFields;
};
