import { getCategoryFilterAggregations } from "@shopware/helpers";

const { search } = useListing({ listingType: "productSearchListing" });

search({
  search: "running",
  aggregations: getCategoryFilterAggregations(),
});
