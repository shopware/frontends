import type { CmsRouteName } from "@shopware/cms-base-layer-react";

export const RENDERED_ROUTE_NAMES: readonly CmsRouteName[] = [
  "frontend.navigation.page",
  "frontend.detail.page",
  "frontend.landing.page",
  "frontend.account.customer-group-registration.page",
];

export function isRenderedRouteName(
  value: string | null | undefined,
): value is CmsRouteName {
  return !!value && (RENDERED_ROUTE_NAMES as readonly string[]).includes(value);
}
