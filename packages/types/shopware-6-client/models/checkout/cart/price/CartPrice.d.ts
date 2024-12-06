import type { CalculatedTax } from "../../../system/tax/CalculatedTax";
import type { TaxRule } from "../../../system/tax/TaxRule";

/**
 * @public
 */
export type CartPrice = {
  netPrice: number;
  totalPrice: number;
  calculatedTaxes: CalculatedTax[];
  taxRules: TaxRule[];
  positionPrice: number;
  taxStatus: string;
};
