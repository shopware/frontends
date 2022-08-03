import { inject } from "vue";
import { CmsElementProductBox, BoxLayout } from "../index";
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
  const boxLayout = computed(() => element.config.boxLayout.value);

  return {
    product,
    boxLayout,
  };
}
