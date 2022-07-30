import { NumberRange } from "./NumberRange";

/**
 * @public
 */
export type NumberRangeState = {
  numberRangeId: string;
  lastValue: number;
  numberRange: NumberRange | null;
};
