import { CustomerGroup } from "./CustomerGroup";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type CustomerGroupTranslation = {
  customerGroupId: string;
  name: string | null;
  customerGroup: CustomerGroup | null;
  customFields: CustomFields;
};
