import type { CustomFields } from "../../common/CustomField";
import type { NumberRangeType } from "./NumberRangeType";

/**
 * @public
 */
export type NumberRangeTypeTranslation = {
  numberRangeTypeId: string;
  typeName: string | null;
  numberRangeType: NumberRangeType | null;
  customFields: CustomFields;
};
