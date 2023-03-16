import { computed, ComputedRef, Ref } from "vue";
import { Category } from "@shopware-pwa/types";
import { _useContext } from "./internal/_useContext";
import ContextError from "./helpers/ContextError";

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
  const _category = _useContext("category", { context: category });
  if (!_category.value) {
    // TODO link docs with composables context usage
    throw new ContextError("Category");
  }

  return {
    category: computed(() => _category.value),
  };
}
