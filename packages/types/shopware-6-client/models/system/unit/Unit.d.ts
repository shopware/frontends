import type { CustomFields } from "../../common/CustomField";
import type { UnitTranslation } from "./UnitTranslation";

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
