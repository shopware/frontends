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
    sections: {
      blocks?: {
        slots?: {
          type?: string;
          data?: Record<string, unknown> | null;
        }[];
      }[];
    }[];
  };

  const listing = page.sections
    .flatMap((section) => section.blocks ?? [])
    .flatMap((block) => block.slots ?? [])
    .find((slot) => slot.type === "product-listing")?.data?.listing as
    | T
    | undefined;

  if (listing) {
    return listing;
  }

  return null;
}
