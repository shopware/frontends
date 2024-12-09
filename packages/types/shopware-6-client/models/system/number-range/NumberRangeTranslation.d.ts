import type { CustomFields } from "../../common/CustomField";
import type { NumberRange } from "./NumberRange";

/**
 * @public
 */
export type NumberRangeTranslation = {
  numberRangeId: string;
  name: string | null;
  description: string | null;
  numberRange: NumberRange | null;
  customFields: CustomFields;
};
