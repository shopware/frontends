import type { SalesChannel } from "../sales-channel/SalesChannel";
import type { NumberRange } from "./NumberRange";
import type { NumberRangeType } from "./NumberRangeType";

/**
 * @public
 */
export type NumberRangeSalesChannel = {
  numberRangeId: string;
  salesChannelId: string;
  numberRange: NumberRange | null;
  salesChannel: SalesChannel | null;
  numberRangeType: NumberRangeType | null;
};
