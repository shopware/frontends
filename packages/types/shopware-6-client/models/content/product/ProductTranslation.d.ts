import type { CustomFields } from "../../common/CustomField";
import type { Product } from "./Product";

/**
 * @public
 */
export type ProductTranslation = {
  productId: string;
  additionalText: string | null;
  name: string | null;
  keywords: string | null;
  description: string | null;
  metaTitle: string | null;
  packUnit: string | null;
  product: Product;
  customFields: CustomFields | null;
};
