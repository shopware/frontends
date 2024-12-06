import type { CustomFields } from "../../common/CustomField";
import type { Product } from "../../content/product/Product";

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
