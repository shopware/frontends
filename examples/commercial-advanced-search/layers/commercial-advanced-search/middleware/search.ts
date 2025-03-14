export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp();
  if (
    !to.path.includes("/search") ||
    (import.meta.client &&
      nuxtApp.isHydrating &&
      nuxtApp.payload.serverRendered)
  )
    return;

  const { $shopwareApiClient } = useNuxtApp();
  try {
    const response = await $shopwareApiClient.invoke(
      "searchPage post /search",
      {
        body: {
          search: to.query.search?.toString() || "",
        },
        headers: {
          "sw-include-seo-urls": true,
        },
      },
    );

    const searchActions = response.data?.extensions?.searchActions;

    if (searchActions?.url) {
      return navigateTo(response.data?.extensions?.searchActions?.url, {
        external: true,
      });
    }

    if (!searchActions?.route) {
      return;
    }

    let path = "";

    if (!searchActions.seoUrls?.length) {
      const routeMap = {
        "frontend.navigation.page": "/navigation",
        "frontend.detail.page": "/detail",
      };

      const routeParameters =
        response.data?.extensions?.searchActions?.routeParameters;
      path = `${routeMap[searchActions.route]}/${
        routeParameters && "navigationId" in routeParameters
          ? routeParameters.navigationId
          : routeParameters?.productId
      }`;
    }

    if (searchActions?.seoUrls) {
      path = searchActions.seoUrls?.[0]?.seoPathInfo;
    }

    return navigateTo({ path });
  } catch (error) {
    console.error(error);
  }
});
