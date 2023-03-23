import { ProductStream } from "./ProductStream";
import { CustomFields } from "../../common/CustomField";

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
