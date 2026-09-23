const { clearBreadcrumbs } = useBreadcrumbs();

onBeforeRouteLeave(() => {
  clearBreadcrumbs();
});
