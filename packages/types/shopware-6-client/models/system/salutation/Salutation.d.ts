import { SalutationTranslation } from "./SalutationTranslation";

/**
 * @public
 */
export type Salutation = {
  salutationKey: string;
  id: string;
  displayName: string | null;
  letterName: string | null;
  createdAt: string;
  translations: SalutationTranslation[] | null;
  translated: object;
  updatedAt: Date | string | null;
  extenstions: object;
};
