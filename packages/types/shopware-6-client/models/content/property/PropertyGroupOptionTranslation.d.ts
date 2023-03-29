import { PropertyGroupOption } from "./PropertyGroupOption";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type PropertyGroupOptionTranslation = {
  propertyGroupOptionId: string;
  name: string | null;
  position: number | null;
  propertyGroupOption: PropertyGroupOption | null;
  customFields: CustomFields;
};
