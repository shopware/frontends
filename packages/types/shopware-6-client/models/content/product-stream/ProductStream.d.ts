import { ProductStreamTranslation } from "./ProductStreamTranslation";
import { ProductStreamFilter } from "./ProductStreamFilter";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type ProductStream = {
  name: string;
  description: string | null;
  apiFilter: [] | null;
  filters: ProductStreamFilter[] | null;
  invalid: boolean;
  translations: ProductStreamTranslation[] | null;
  customFields: CustomFields;
};
