import { Language } from "../../framework/language/Language";

/**
 * @public
 */
export type ProductKeywordDictionary = {
  id: string;
  languageId: string;
  keyword: string;
  reserved: string;
  language: Language | null;
};
