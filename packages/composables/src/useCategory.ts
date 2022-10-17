import { computed, ComputedRef, Ref } from "vue";
import { Category } from "@shopware-pwa/types";
import { _useContext } from "./internal/_useContext";

export type UseCategoryReturn = {
  category: ComputedRef<Category>;
};

export function useCategory(category?: Ref<Category>): UseCategoryReturn {
  const _category = _useContext("category", category);
  if (!_category.value) {
    // TODO link docs with composables context usage
    throw new Error("Category context is not provided.");
  }

  return {
    category: computed(() => _category.value),
  };
}
