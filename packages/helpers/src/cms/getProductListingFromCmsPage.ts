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
  cmsPage: unknown,
): T | null {
  // Type guard to check if cmsPage has the expected structure
  if (
    !cmsPage ||
    typeof cmsPage !== "object" ||
    !("sections" in cmsPage) ||
    !Array.isArray((cmsPage as { sections: unknown }).sections)
  ) {
    return null;
  }

  const page = cmsPage as {
    sections: Array<{
      blocks?: Array<{
        slots?: Array<{
          type?: string;
          data?: Record<string, unknown> | null;
        }>;
      }>;
    }>;
  };

  // Optimized: avoid creating temporary arrays, use optional chaining
  for (const section of page.sections) {
    if (!section.blocks?.length) continue;

    for (const block of section.blocks) {
      if (!block.slots?.length) continue;

      for (const slot of block.slots) {
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
