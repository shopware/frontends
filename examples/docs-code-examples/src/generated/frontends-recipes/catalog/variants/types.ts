import type { Schemas, operations } from "#shopware";

type ProductDetailResponse = Schemas["ProductDetailResponse"];
type PropertyGroup = Schemas["PropertyGroup"];
type PropertyGroupOption = Schemas["PropertyGroupOption"];
type FindVariantBody =
  operations["searchProductVariantIds post /product/{productId}/find-variant"]["body"];
type Product = Schemas["Product"];

// what the find-variant route actually answers with
type FoundCombination = {
  variantId?: string;
  options?: string[];
};
