type CmsPageStructure = {
  sections: Array<{
    blocks?: Array<{
      slots?: Array<{
        type?: string;
        data?: unknown;
        [key: string]: unknown;
      }>;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

/**
 * Extracts the product listing data from a CMS page structure.
 * Useful for SSR to get listing data early before components render.
 *
 * @param cmsPage - The CMS page object (Schemas["CmsPage"])
 * @returns The product listing result or null if not found
 *
 * @example
 * ```ts
 * const listing = getProductListingFromCmsPage(cmsPage);
 * createCategoryListingContext(listing);
 * ```
 */
export function getProductListingFromCmsPage<T = unknown>(
  cmsPage: CmsPageStructure,
): T | null {
  const slot = cmsPage.sections
    .flatMap((section) => section.blocks ?? [])
    .flatMap((block) => block.slots ?? [])
    .find((slot) => slot.type === "product-listing");

  const listing = (slot?.data as { listing?: T } | null | undefined)?.listing;

  return listing ?? null;
}
