import type { CustomFields } from "../../common/CustomField";
import type { CountryState } from "./CountryState";

/**
 * @public
 */
export type CountryStateTranslation = {
  countryStateId: string;
  name: string | null;
  countryState: CountryState | null;
  customFields: CustomFields;
};
