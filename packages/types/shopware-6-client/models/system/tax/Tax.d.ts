import { Product } from "../../content/product/Product";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type Tax = {
  taxRate: number;
  name: string;
  products?: Product[] | null;
  customFields: CustomFields | null;
  translated: [];
  createdAt: Date | string;
  updatedAt: Date | string | null;
  position: number;
  id: string;
  apiAlias: string;
};
