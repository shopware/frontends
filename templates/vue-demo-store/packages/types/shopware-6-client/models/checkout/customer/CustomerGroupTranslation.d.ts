import { CustomerGroup } from "./CustomerGroup";
import { CustomField } from "../../common/CustomField";

/**
 * @public
 */
export type CustomerGroupTranslation = {
  customerGroupId: string;
  name: string | null;
  customerGroup: CustomerGroup | null;
  customFields: CustomField[];
};
