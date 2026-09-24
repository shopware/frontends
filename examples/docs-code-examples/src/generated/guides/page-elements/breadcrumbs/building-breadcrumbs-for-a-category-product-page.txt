// props.navigationId is a page id

import { useBreadcrumbs } from "#imports";

const { buildDynamicBreadcrumbs } = useBreadcrumbs();
buildDynamicBreadcrumbs(props.navigationId);
