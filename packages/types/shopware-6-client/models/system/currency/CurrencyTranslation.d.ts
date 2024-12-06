import type { CustomFields } from "../../common/CustomField";
import type { Currency } from "./Currency";

/**
 * @public
 */
export type CurrencyTranslation = {
  currencyId: string;
  shortName: string | null;
  name: string | null;
  currency: Currency | null;
  customFields: CustomFields;
};
