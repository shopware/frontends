import type { CustomFields } from "../../common/CustomField";
import type { Locale } from "./Locale";

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
