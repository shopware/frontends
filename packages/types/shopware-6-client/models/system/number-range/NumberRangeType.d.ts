import { NumberRange } from "./NumberRange";
import { NumberRangeSalesChannel } from "./NumberRangeSalesChannel";
import { CustomFields } from "../../common/CustomField";
import { NumberRangeTypeTranslation } from "./NumberRangeTypeTranslation";

/**
 * @public
 */
export type NumberRangeType = {
  typeName: string;
  technicalName: string;
  global: boolean;
  numberRanges: NumberRange[] | null;
  numberRangeSalesChannels: NumberRangeSalesChannel | null;
  customFields: CustomFields;
  translations: NumberRangeTypeTranslation[] | null;
};
