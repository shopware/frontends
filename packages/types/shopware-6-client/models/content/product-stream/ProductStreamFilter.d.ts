import type { CustomFields } from "../../common/CustomField";
import type { ProductStream } from "./ProductStream";

/**
 * @public
 */
export type ProductStreamFilter = {
  type: string;
  field: string | null;
  operator: string | null;
  value: string | null;
  productStreamId: string;
  parentId: string | null;
  productStream: ProductStream | null;
  queries: ProductStreamFilter[] | null;
  parent: ProductStreamFilter | null;
  position: number;
  parameters: [] | null;
  customFields: CustomFields;
};
