import type { CustomFields } from "../../common/CustomField";
import type { PropertyGroupOption } from "./PropertyGroupOption";
import type { PropertyGroupOptionTranslation } from "./PropertyGroupOptionTranslation";

/**
 * @public
 */
export type PropertyGroup = {
  id: string;
  name: string;
  displayType: string;
  sortingType: string;
  description: string | null;
  options: PropertyGroupOption[] | null;
  translations: PropertyGroupOptionTranslation[] | null;
  customFields: CustomFields;
  translated: {
    [key: string]: string;
  };
  apiAlias: "property_group";
};
