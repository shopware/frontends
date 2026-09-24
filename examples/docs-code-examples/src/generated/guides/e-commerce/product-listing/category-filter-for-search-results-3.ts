import {
  CATEGORY_AGGREGATION_NAME,
  CATEGORY_COUNTS_AGGREGATION_NAME,
  CATEGORY_PARENTS_AGGREGATION_NAME,
} from "@shopware/helpers";

const aggregations = [
  {
    name: CATEGORY_AGGREGATION_NAME,
    type: "entity",
    definition: "category",
    field: "categoriesRo.id",
  },
  {
    name: CATEGORY_COUNTS_AGGREGATION_NAME,
    type: "terms",
    field: "categoriesRo.id",
    aggregation: {
      name: CATEGORY_PARENTS_AGGREGATION_NAME,
      type: "terms",
      field: "parentId",
    },
  },
];
