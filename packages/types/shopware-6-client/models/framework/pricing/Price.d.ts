export type Price = {
  net: number;
  gross: number;
  linked: boolean;
  listPrice: null;
  currencyId: number;
  regulationPrice: null | Partial<Price>;
  percentage: null;
  apiAlias: "price";
};
