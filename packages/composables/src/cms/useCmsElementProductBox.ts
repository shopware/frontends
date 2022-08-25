import { inject } from "vue";
import { CmsElementProductBox, BoxLayout, useCmsElementConfig } from "../index";
import { computed, ComputedRef } from "vue";
import { Product } from "@shopware-pwa/types";

export type UseCmsElementProductBox = {
  product: Product;
  boxLayout: ComputedRef<BoxLayout>;
};

export function useCmsElementProductBox(
  element: CmsElementProductBox
): UseCmsElementProductBox {
  const product = inject("product", element.data.product);

  const { getConfigValue } = useCmsElementConfig(element);
  const boxLayout = computed(() => getConfigValue("boxLayout"));

  return {
    product,
    boxLayout,
  };
}
