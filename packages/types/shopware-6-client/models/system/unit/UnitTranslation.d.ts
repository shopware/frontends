import type { CustomFields } from "../../common/CustomField";
import type { Unit } from "./Unit";

/**
 * @public
 */
export type UnitTranslation = {
  unitId?: string;
  shortCode: string | null;
  name: string | null;
  unit?: Unit | null;
  customFields: CustomFields;
};
