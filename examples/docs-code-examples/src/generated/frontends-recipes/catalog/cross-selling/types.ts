import type { Schemas, operations } from "#shopware";

type CrossSellingResponse =
  operations["readProductCrossSellings post /product/{productId}/cross-selling"]["response"];
type CrossSellingCollection = Schemas["CrossSellingElementCollection"];
type CrossSellingElement = Schemas["CrossSellingElement"];
type CrossSellingConfig = Schemas["ProductCrossSelling"];
