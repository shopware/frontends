import type { CustomFields } from "../../common/CustomField";
import type { Language } from "../../framework/language/Language";
import type { SnippetSet } from "../../framework/snippet/SnippetSet";
import type { Currency } from "../currency/Currency";
import type { SalesChannel } from "./SalesChannel";

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
