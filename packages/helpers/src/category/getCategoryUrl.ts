import { Category } from "@shopware-pwa/types";

type LinkedCategory = Pick<
  Category,
  "type" | "externalLink" | "seoUrls" | "internalLink" | "id" | "linkType"
>;

/**
 * Extract prefix for technical URL
 */
function getEntityPrefix(category: LinkedCategory) {
  switch (category.linkType) {
    case "category":
      return "navigation";
    case "product":
      return "detail";
    case "landing_page":
      return "landingPage";
  }
}

/**
 * Get URL for category.
 * Some link {@link isLinkCategory}
 *
 * @param {Category} category category entity
 *
 * @public
 */
export function getCategoryUrl(category: LinkedCategory): string {
  if (!category) return "/";

  switch (category.type) {
    case undefined:
      return "/";
    case "link":
      return (
        category.externalLink ||
        category?.seoUrls?.[0]?.seoPathInfo ||
        `/${getEntityPrefix(category)}/${category.internalLink}`
      );
    default:
      return category.seoUrls?.[0]?.seoPathInfo
        ? `/${category.seoUrls[0].seoPathInfo}`
        : `/${getEntityPrefix(category)}/${category.id}`;
  }
}

// TODO: move to separate file and add tests
export function getCategoryRoute(category: LinkedCategory) {
  return {
    path: getCategoryUrl(category),
    state: {
      routeName: "frontend.navigation.page",
      foreignKey: category?.id,
    },
  };
}

// TODO: move to separate file and add tests
export function getNavigationRoute(navigationElement: LinkedCategory) {
  if (navigationElement.linkType == "product") {
    return {
      path: getCategoryUrl(navigationElement),
      // TODO: figure out navigation links pointed directly into product page
      // state: {},
    };
  } else {
    return getCategoryRoute(navigationElement);
  }
}
