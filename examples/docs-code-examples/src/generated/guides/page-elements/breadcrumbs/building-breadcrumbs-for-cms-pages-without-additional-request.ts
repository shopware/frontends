import { getCategoryBreadcrumbs } from "@shopware/helpers";

import { useBreadcrumbs } from "#imports";

const productResponse = {
  product: {
    seoCategory: {
      breadcrumb: ["Home", "Example category"],
      translated: {
        breadcrumb: ["Home", "Example category"],
      },
    },
  },
};

const breadcrumbs = getCategoryBreadcrumbs(productResponse.product.seoCategory);
useBreadcrumbs(breadcrumbs);
