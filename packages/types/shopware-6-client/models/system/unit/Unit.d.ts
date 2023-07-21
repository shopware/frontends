import { UnitTranslation } from "./UnitTranslation";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type Unit = {
  shortCode: string | null;
  name: string | null;
  translated: UnitTranslation | null;
  customFields: CustomFields | null;
  createdAt: Date | string;
  updatedAt: Date | string | null;
  id: string;
  apiAlias: string;
};
