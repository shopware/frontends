/**
 * Extract prefix for technical URL
 */
function getEntityPrefix<
  T extends {
    linkType?: string;
  },
>(category: T) {
  switch (category.linkType) {
    case "category":
      return "navigation";
    case "product":
      return "detail";
    case "landing_page":
      return "landingPage";
    default:
      return "navigation";
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
export function getCategoryUrl<
  T extends {
    type: string;
    externalLink?: string;
    seoUrls?: { seoPathInfo: string }[];
    internalLink?: string;
    id: string;
    linkType?: string;
  },
>(category: T): string {
  if (!category) return "/";

  switch (category.type) {
    case undefined:
      return "/";
    case "link":
      return (
        category.externalLink ||
        (category?.seoUrls?.[0]?.seoPathInfo &&
          `/${category?.seoUrls?.[0]?.seoPathInfo.replace(/^\/+/, "")}`) ||
        `/${getEntityPrefix(category)}/${category.internalLink}`
      );
    default:
      return category.seoUrls?.[0]?.seoPathInfo
        ? `/${category.seoUrls[0].seoPathInfo}`
        : `/${getEntityPrefix(category)}/${category.id}`;
  }
}
