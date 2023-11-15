import { SalutationTranslation } from "./SalutationTranslation";
import { CustomFields } from "../models/common/CustomField";
import { Schemas } from "#shopware";
/**
 * @deprecated use {Schemas['Salutation']} instead from "#shopware" import
 */
export type Salutation = Schemas["Salutation"];
//   {
//   salutationKey: string;
//   id: string;
//   displayName: string | null;
//   letterName: string | null;
//   createdAt: string;
//   translations?: SalutationTranslation[] | null;
//   translated: object;
//   updatedAt: Date | string | null;
//   extensions?: object;
//   customFields: CustomFields;
//   apiAlias: string;
// };
