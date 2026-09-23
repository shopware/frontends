import { getCategoryBreadcrumbs } from "@shopware/helpers";

let breadcrumbs = getCategoryBreadcrumbs(
  productResponse.value?.product?.seoCategory,
);
useBreadcrumbs(breadcrumbs);
