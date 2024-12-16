import type { CustomFields } from "../../common/CustomField";
import type { PropertyGroupOption } from "./PropertyGroupOption";

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
