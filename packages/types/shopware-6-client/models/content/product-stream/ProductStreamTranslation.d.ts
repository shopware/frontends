import type { CustomFields } from "../../common/CustomField";
import type { ProductStream } from "./ProductStream";

/**
 * @public
 */
export type ProductStreamTranslation = {
  productStreamId: string;
  name: string | null;
  description: string | null;
  productStream: ProductStream | null;
  customFields: CustomFields;
};
