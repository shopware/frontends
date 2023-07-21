import { Unit } from "./Unit";
import { CustomFields } from "../../common/CustomField";

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
