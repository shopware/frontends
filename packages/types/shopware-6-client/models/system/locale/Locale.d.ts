import { LocaleTranslation } from "./LocaleTranslation";
import { Language } from "../../framework/language/Language";
import { CustomFields } from "../../common/CustomField";
import { Customer } from "../../checkout/customer/Customer";

/**
 * @public
 */
export type Locale = {
  code: string;
  name: string | null;
  territory: string | null;
  translations: LocaleTranslation[] | null;
  translated: LocaleTranslation[] | null;
  users: Customer[] | null;
  languages: Language[] | null;
  id: string;
  customFields: CustomFields | null;
  apiAlias: "locale";
  createdAt: Date | string;
  updatedAt: Date | string | null;
};
