import { NumberRangeType } from "./NumberRangeType";
import { CustomField } from "../../common/CustomField";

/**
 * @public
 */
export type NumberRangeTypeTranslation = {
  numberRangeTypeId: string;
  typeName: string | null;
  numberRangeType: NumberRangeType | null;
  customFields: CustomField[];
};
