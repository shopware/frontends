import { computed } from "vue";
import type { ComputedRef, Ref } from "vue";
import ContextError from "../helpers/ContextError";
import { useContext } from "#imports";
import type { Schemas } from "#shopware";

export type UseCategoryReturn = {
  /**
   * Current category entity
   */
  category: ComputedRef<Schemas["Category"]>;
};

/**
 * Composable to get the category from current CMS context
 *
 * @category Product
 * @public
 */
export function useCategory(
  category?: Ref<Schemas["Category"]>,
): UseCategoryReturn {
  const _category = useContext("category", { context: category });
  if (!_category.value) {
    // TODO link docs with composables context usage
    throw new ContextError("Category");
  }

  return {
    category: computed(() => _category.value),
  };
}
