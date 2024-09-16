import { computed } from "vue";
import type { ComputedRef, Ref } from "vue";
import ContextError from "../helpers/ContextError";
import type { Schemas } from "#shopware";
import { useContext } from "#imports";

export type UseProductReturn = {
  /**
   * Returns product object
   * {@link Product} object
   */
  product: ComputedRef<Schemas["Product"]>;
  /**
   * {@link PropertyGroup} array that defines the product possible configurations
   */
  configurator: ComputedRef<Schemas["PropertyGroup"][]>;
  /**
   * Merges the current product with the new variant data
   * @param variant - {@link Product} object with the new variant data
   */
  changeVariant(variant?: Partial<Schemas["Product"]>): void;
};

/**
 * Composable for product management.
 * @public
 * @category Product
 */
export function useProduct(
  product?: Ref<Schemas["Product"]> | Schemas["Product"],
  configurator?: Ref<Schemas["PropertyGroup"][]> | Schemas["PropertyGroup"][],
): UseProductReturn {
  const _product = useContext("product", { context: product });
  if (!_product.value) {
    // TODO link docs with composables context usage
    throw new ContextError("Product");
  }

  const _configurator = useContext("configurator", {
    context: product && configurator,
  });

  function changeVariant(variant?: Partial<Schemas["Product"]>) {
    if (!variant) {
      console.warn("[useProduct][changeVariant]: Provided variant is empty");
      return;
    }
    _product.value = Object.assign({}, _product.value, variant);
  }

  return {
    product: computed(() => _product.value),
    configurator: computed(() => _configurator.value),
    changeVariant,
  };
}
