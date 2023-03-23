import { NumberRangeType } from "./NumberRangeType";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type NumberRangeTypeTranslation = {
  numberRangeTypeId: string;
  typeName: string | null;
  numberRangeType: NumberRangeType | null;
  customFields: CustomFields;
};
