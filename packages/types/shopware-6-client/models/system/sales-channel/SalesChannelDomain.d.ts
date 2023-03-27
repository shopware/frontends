import { Language } from "../../framework/language/Language";
import { SalesChannel } from "./SalesChannel";
import { SnippetSet } from "../../framework/snippet/SnippetSet";
import { Currency } from "../currency/Currency";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type SalesChannelDomain = {
  url: string;
  currencyId: string | null;
  currency: Currency | null;
  snippetSetId: string | null;
  snippetSet: SnippetSet | null;
  salesChannelId: string;
  salesChannel: SalesChannel | null;
  languageId: string;
  language: Language | null;
  customFields: CustomFields;
};
