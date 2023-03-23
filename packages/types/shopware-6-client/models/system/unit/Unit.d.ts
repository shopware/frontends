import { UnitTranslation } from "./UnitTranslation";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type Unit = {
  shortCode: string | null;
  name: string | null;
  translated: UnitTranslation | null;
  customFields: CustomFields;
};
