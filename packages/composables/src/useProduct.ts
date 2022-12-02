import { computed, ComputedRef, Ref } from "vue";
import { Product, PropertyGroup } from "@shopware-pwa/types";
import { _useContext } from "./internal/_useContext";

export type UseProductReturn = {
  product: ComputedRef<Product>;
  configurator: ComputedRef<PropertyGroup[]>;
  changeVariant: (variant: Partial<Product>) => void;
};

export function useProduct(
  product?: Ref<Product> | Product,
  configurator?: Ref<PropertyGroup[]> | PropertyGroup[]
): UseProductReturn {
  const _product = _useContext("product", { context: product });
  if (!_product.value) {
    // TODO link docs with composables context usage
    throw new Error("Product context is not provided");
  }
  const _configurator = _useContext("configurator", {
    context: product && configurator,
  });

  function changeVariant(variant: Partial<Product>) {
    _product.value = Object.assign({}, _product.value, variant);
  }

  return {
    product: computed(() => _product.value),
    configurator: computed(() => _configurator.value),
    changeVariant,
  };
}
