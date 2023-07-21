import { CountryState } from "./CountryState";
import { CustomField } from "../../common/CustomField";

/**
 * @public
 */
export type CountryStateTranslation = {
  countryStateId: string;
  name: string | null;
  countryState: CountryState | null;
  customFields: CustomField[];
};
