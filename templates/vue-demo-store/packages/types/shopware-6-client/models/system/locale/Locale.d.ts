import { LocaleTranslation } from "./LocaleTranslation";
import { Language } from "../../framework/language/Language";
import { CustomField } from "../../common/CustomField";
import { Customer } from "../../checkout/customer/Customer";

/**
 * @public
 */
export type Locale = {
  code: string;
  name: string | null;
  territory: string | null;
  translations: LocaleTranslation[] | null;
  users: Customer[] | null;
  languages: Language[] | null;
  customFields: CustomField | null;
};
