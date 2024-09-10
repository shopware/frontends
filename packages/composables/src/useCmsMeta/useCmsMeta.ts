import { computed } from "vue";
import type { ComputedRef } from "vue";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import type { Schemas } from "#shopware";

export type UseCmsMetaReturn = {
  /**
   * Meta title for current page/entity
   */
  title: ComputedRef<string>;
  /**
   * Meta tags for current page/entity
   */
  meta: ComputedRef<{ name: string; content: string }[]>;
};

/**
 * TODO: remove parameter and use reactive state of cmsResponse provided by useCms composable
 * @category CMS (Shopping Experiences)
 */
export function useCmsMeta(
  entity: Schemas["Category"] | Schemas["Product"] | Schemas["LandingPage"],
): UseCmsMetaReturn {
  const meta = computed(() => {
    const entries = [];
    const keywords = getTranslatedProperty(entity, "keywords");
    const description = getTranslatedProperty(entity, "metaDescription");
    const title = getTranslatedProperty(entity, "metaTitle");
    if (keywords) {
      entries.push({ name: "keywords", content: keywords });
    }
    if (description) {
      entries.push({ name: "description", content: description });
    }
    if (title) {
      entries.push({ name: "title", content: title });
    }

    return entries;
  });

  return {
    title: computed(() => getTranslatedProperty(entity, "name")),
    meta,
  };
}
