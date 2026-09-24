import { onBeforeRouteLeave, useBreadcrumbs } from "#imports";

const { clearBreadcrumbs } = useBreadcrumbs();

onBeforeRouteLeave(() => {
  clearBreadcrumbs();
});
