import { Country } from "./Country";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type CountryTranslation = {
  countryId: string;
  name: string | null;
  country: Country | null;
  customFields: CustomFields;
};
