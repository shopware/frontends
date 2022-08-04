import { PropertyGroupOption } from "./PropertyGroupOption";
import { CustomField } from "../../common/CustomField";
import { PropertyGroupOptionTranslation } from "./PropertyGroupOptionTranslation";

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
  customFields: CustomField[];
  translated: {
    [key: string]: unknown;
  };
  apiAlias: "property_group";
};
