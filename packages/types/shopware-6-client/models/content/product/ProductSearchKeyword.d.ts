import type { Language } from "../../framework/language/Language";
import type { Product } from "./Product";

/**
 * @public
 */
export type ProductSearchKeyword = {
  languageId: string;
  productId: string;
  keyword: string;
  ranking: number;
  product: Product | null;
  language: Language | null;
};
