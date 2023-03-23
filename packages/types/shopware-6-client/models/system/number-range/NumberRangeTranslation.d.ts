import { NumberRange } from "./NumberRange";
import { CustomFields } from "../../common/CustomField";

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
