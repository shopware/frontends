import type { CustomFields } from "../../common/CustomField";
import type { ProductStreamFilter } from "./ProductStreamFilter";
import type { ProductStreamTranslation } from "./ProductStreamTranslation";

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
