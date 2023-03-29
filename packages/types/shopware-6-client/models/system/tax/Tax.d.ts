import { Product } from "../../content/product/Product";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type Tax = {
  taxRate: number;
  name: string;
  products: Product[] | null;
  customFields: CustomFields;
};
