import type { CustomFields } from "../../common/CustomField";
import type { Country } from "./Country";

/**
 * @public
 */
export type CountryTranslation = {
  countryId: string;
  name: string | null;
  country: Country | null;
  customFields: CustomFields;
};
