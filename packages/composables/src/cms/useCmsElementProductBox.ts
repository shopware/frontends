import { inject } from "vue";
import { useCmsElementConfig } from "../index";
import type { CmsElementProductBox, BoxLayout } from "../index";
import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { Schemas } from "#shopware";

export type UseCmsElementProductBox = {
  product: Schemas["Product"];
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
