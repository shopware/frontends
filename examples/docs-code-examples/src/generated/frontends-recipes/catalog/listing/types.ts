import type { Schemas, operations } from "#shopware";

type CategoryListingBody =
  operations["readProductListing post /product-listing/{categoryId}"]["body"];
type SearchBody = operations["searchPage post /search"]["body"];
type ProductListingResult = Schemas["ProductListingResult"];
type ProductListingCriteria = Schemas["ProductListingCriteria"];
type Product = Schemas["Product"];
