import { TaxRule } from "../../../system/tax/TaxRule";
import { CalculatedPrice } from "./CalculatedPrice";

export type PriceDefinitionInterface = {
  apiAlias: "cart_price_quantity";
  isCalculated: boolean;
  listPrice: CalculatedPrice | null;
  price: number;
  quantity: number;
  referencePriceDefinition: unknown | null;
  regulationPrice: unknown | null;
  taxRules: TaxRule[];
  type: "quantity" | string;
  percentage: unknown;
};
