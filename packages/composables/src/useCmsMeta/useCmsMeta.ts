import { getCmsMeta } from "@shopware/helpers";
import { computed } from "vue";
import type { ComputedRef } from "vue";

import type { Schemas } from "#shopware";

/**
 * @deprecated Use `getCmsMeta` from `@shopware/helpers` instead. Will be removed in the next major release.
 */
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
 * @deprecated Use `getCmsMeta` from `@shopware/helpers` instead, inside a `computed` to keep following in-place changes of a reactive entity. Will be removed in the next major release.
 * @category CMS (Shopping Experiences)
 */
export function useCmsMeta(
  entity: Schemas["Category"] | Schemas["Product"] | Schemas["LandingPage"],
): UseCmsMetaReturn {
  const meta = computed(() => {
    const { keywords, metaDescription, metaTitle } = getCmsMeta(entity);
    const entries = [];
    if (keywords) {
      entries.push({ name: "keywords", content: keywords });
    }
    if (metaDescription) {
      entries.push({ name: "description", content: metaDescription });
    }
    if (metaTitle) {
      entries.push({ name: "title", content: metaTitle });
    }

    return entries;
  });

  return {
    title: computed(() => getCmsMeta(entity).title),
    meta,
  };
}
