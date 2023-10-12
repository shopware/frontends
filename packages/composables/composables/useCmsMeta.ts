import { computed, ComputedRef } from "vue";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import type { CmsPageEntity } from "@shopware-pwa/types";

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
 */
export function useCmsMeta(entity: CmsPageEntity): UseCmsMetaReturn {
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
