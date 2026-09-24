// part of <script setup> section
import { useListing } from "#imports";

const { getCurrentSortingOrder, getSortingOrders, changeCurrentSortingOrder } =
  useListing({
    listingType: "categoryListing",
    categoryId: "dfd52ab937f840fd87e9d24ebf6bd245",
    defaultSearchCriteria: {
      limit: 3,
      p: 1,
    },
  });
