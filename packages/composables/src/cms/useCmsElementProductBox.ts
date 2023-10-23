import { inject } from "vue";
import { useCmsElementConfig } from "../index";
import type { CmsElementProductBox, BoxLayout } from "../index";
import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { Product } from "@shopware-pwa/types";

export type UseCmsElementProductBox = {
  product: Product;
  boxLayout: ComputedRef<BoxLayout>;
};

export function useCmsElementProductBox(
  element: CmsElementProductBox,
): UseCmsElementProductBox {
  const product = inject("product", element.data.product);

  const { getConfigValue } = useCmsElementConfig(element);
  const boxLayout = computed(() => getConfigValue("boxLayout"));

  return {
    product,
    boxLayout,
  };
}
