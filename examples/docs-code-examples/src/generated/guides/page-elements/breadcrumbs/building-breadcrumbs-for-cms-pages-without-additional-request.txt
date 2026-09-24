import { getCategoryBreadcrumbs } from "@shopware/helpers";

import { useBreadcrumbs } from "#imports";

let breadcrumbs = getCategoryBreadcrumbs(
  productResponse.value?.product?.seoCategory,
);
useBreadcrumbs(breadcrumbs);
