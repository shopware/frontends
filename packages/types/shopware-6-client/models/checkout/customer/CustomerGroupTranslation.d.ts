import type { CustomFields } from "../../common/CustomField";
import type { CustomerGroup } from "./CustomerGroup";

/**
 * @public
 */
export type CustomerGroupTranslation = {
  customerGroupId: string;
  name: string | null;
  customerGroup: CustomerGroup | null;
  customFields: CustomFields;
};
