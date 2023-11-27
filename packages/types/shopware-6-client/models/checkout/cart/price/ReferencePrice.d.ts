/**
 * @deprecated use {@link Schemas["CalculatedPrice"]} from "#shopware" import instead
 */
export type ReferencePrice = {
  price: number;
  purchaseUnit: number;
  referenceUnit: number | string;
  unitName: string;
  apiAlias?: string;
};
