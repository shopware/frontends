import type { Schemas } from "#shopware";
// import { CalculatedTax } from "../../../system/tax/CalculatedTax";
// import { TaxRule } from "../../../system/tax/TaxRule";
// import { ReferencePrice } from "./ReferencePrice";

/**
 * @deprecated use {@link Schemas["CalculatedPrice"]} from "#shopware" import instead
 */
export type CalculatedPrice = Schemas["CalculatedPrice"];
// export type CalculatedPrice = {
//   unitPrice: number;
//   quantity: number;
//   totalPrice: number;
//   calculatedTaxes: CalculatedTax[];
//   taxRules: TaxRule[];
//   referencePrice: ReferencePrice;
//   hasRange?: boolean;
//   listPrice: {
//     price: number;
//     discount: number;
//     percentage: number;
//     apiAlias: string;
//   } | null;
//   regulationPrice: null | {
//     price: number;
//   };
//   apiAlias: string;
//   variantId?: string;
// };
