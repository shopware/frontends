import type { CustomFields } from "../../common/CustomField";
import type { NumberRange } from "./NumberRange";
import type { NumberRangeSalesChannel } from "./NumberRangeSalesChannel";
import type { NumberRangeTypeTranslation } from "./NumberRangeTypeTranslation";

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
