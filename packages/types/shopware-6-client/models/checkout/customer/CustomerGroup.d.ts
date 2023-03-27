import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type CustomerGroup = {
  id: string;
  name: string;
  displayGross: boolean;
  customFields: CustomFields;
};
