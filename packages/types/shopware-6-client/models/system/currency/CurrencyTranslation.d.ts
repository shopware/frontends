import { Currency } from "./Currency";
import { CustomFields } from "../../common/CustomField";

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
