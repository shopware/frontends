import { Locale } from "./Locale";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type LocaleTranslation = {
  localeId: string;
  name: string | null;
  territory: string | null;
  locale: Locale | null;
  customFields: CustomFields | null;
};
