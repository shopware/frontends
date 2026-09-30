import type { Schemas, operations } from "#shopware";

type SearchBody = operations["searchPage post /search"]["body"];
type SuggestBody = operations["searchSuggest post /search-suggest"]["body"];
type SearchResult = operations["searchPage post /search"]["response"];
type ProductDetailResponse = Schemas["ProductDetailResponse"];
type ListingFlags = Schemas["ProductListingFlags"];
