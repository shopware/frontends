import { computed } from "vue";
import type { ComputedRef, Ref } from "vue";
import type { Category } from "@shopware-pwa/types";
import ContextError from "./helpers/ContextError";
import { useContext } from "#imports";

export type UseCategoryReturn = {
  /**
   * Current category entity
   */
  category: ComputedRef<Category>;
};

/**
 * Composable to get the category from current CMS context
 *
 * @public
 */
export function useCategory(category?: Ref<Category>): UseCategoryReturn {
  const _category = useContext("category", { context: category });
  if (!_category.value) {
    // TODO link docs with composables context usage
    throw new ContextError("Category");
  }

  return {
    category: computed(() => _category.value),
  };
}
