type CmsSlot = {
  type?: string;
  data?: {
    listing?: unknown;
    [key: string]: unknown;
  };
};

type CmsBlock = {
  slots?: CmsSlot[];
};

type CmsSection = {
  blocks?: CmsBlock[];
};

type CmsPage = {
  sections?: CmsSection[];
};

/**
 * Extracts the product listing data from a CMS page structure.
 * Useful for SSR to get listing data early before components render.
 *
 * @param cmsPage - The CMS page object
 * @returns The product listing result or null if not found
 *
 * @example
 * ```ts
 * const listing = getProductListingFromCmsPage(cmsPage);
 * createCategoryListingContext(listing);
 * ```
 */
export function getProductListingFromCmsPage<T = unknown>(
  cmsPage: CmsPage | null | undefined,
): T | null {
  // Early exit - avoid unnecessary iterations
  if (!cmsPage?.sections?.length) {
    return null;
  }

  // Optimized: avoid creating temporary arrays, use optional chaining
  for (const section of cmsPage.sections) {
    if (!section.blocks?.length) continue;

    for (const block of section.blocks) {
      if (!block.slots?.length) continue;

      for (const slot of block.slots) {
        // Direct property access is faster than optional chaining in hot path
        if (slot.type === "product-listing") {
          const listing = slot.data?.listing;
          if (listing) {
            return listing as T;
          }
        }
      }
    }
  }

  return null;
}
