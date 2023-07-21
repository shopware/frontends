import { CountryState } from "./CountryState";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type CountryStateTranslation = {
  countryStateId: string;
  name: string | null;
  countryState: CountryState | null;
  customFields: CustomFields;
};
