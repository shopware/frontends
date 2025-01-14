import type { CustomFields } from "../../common/CustomField";
import type { NumberRangeSalesChannel } from "./NumberRangeSalesChannel";
import type { NumberRangeState } from "./NumberRangeState";
import type { NumberRangeTranslation } from "./NumberRangeTranslation";
import type { NumberRangeType } from "./NumberRangeType";

/**
 * @public
 */
export type NumberRange = {
  typeId: string | null;
  global: boolean;
  name: string | null;
  description: string | null;
  pattern: string | null;
  start: number | null;
  type: NumberRangeType | null;
  numberRangeSalesChannels: NumberRangeSalesChannel[] | null;
  state: NumberRangeState | null;
  customFields: CustomFields;
  translations: NumberRangeTranslation[] | null;
};
