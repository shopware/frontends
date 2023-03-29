import { ProductStream } from "./ProductStream";
import { CustomFields } from "../../common/CustomField";

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
