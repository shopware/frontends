const HEADLESS_ROUTE_NAME_MAP = {
  "store-api.product.detail": "frontend.detail.page",
  "store-api.category.detail": "frontend.navigation.page",
  "store-api.landing-page.detail": "frontend.landing.page",
} as const;

export type HeadlessRouteName = keyof typeof HEADLESS_ROUTE_NAME_MAP;

/**
 * Map the SEO URL route name of a headless (API type) sales channel to its
 * storefront equivalent used for page resolution. Any other route name is
 * returned unchanged.
 *
 * Headless sales channels persist their SEO URLs against the `store-api.*`
 * route family (see shopware/shopware#17991), while all routing helpers and
 * page resolvers work with the `frontend.*` names.
 *
 * @public
 * @category Routing
 */
export function getFrontendRouteName(routeName: string): string;
export function getFrontendRouteName(
  routeName: string | undefined,
): string | undefined;
export function getFrontendRouteName(
  routeName: string | undefined,
): string | undefined {
  if (!routeName) return routeName;
  return HEADLESS_ROUTE_NAME_MAP[routeName as HeadlessRouteName] ?? routeName;
}
