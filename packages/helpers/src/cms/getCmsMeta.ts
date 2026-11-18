import { getTranslatedProperty } from "../getTranslatedProperty";

type CmsMetaFields = {
  name?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
};

/**
 * Get the translated name and meta fields of a category, product or landing page.
 * A missing field is returned as an empty string.
 *
 * @public
 * @category CMS (Shopping Experiences)
 */
export function getCmsMeta(
  entity: CmsMetaFields & { translated?: CmsMetaFields | null },
): {
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
} {
  return {
    title: getTranslatedProperty(entity, "name"),
    metaTitle: getTranslatedProperty(entity, "metaTitle"),
    metaDescription: getTranslatedProperty(entity, "metaDescription"),
    keywords: getTranslatedProperty(entity, "keywords"),
  };
}
