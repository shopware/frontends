import { Product } from "./Product";
import { CustomFields } from "../../common/CustomField";

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
