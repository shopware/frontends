import {
  getProductCalculatedListingPrice,
  getProductFromPrice,
  getProductTierPrices,
} from "@shopware-pwa/helpers-next";
import { Product } from "@shopware-pwa/types";
import { computed, ComputedRef, Ref } from "vue";

export type UseProductPriceReturn = {
  fromPrice: ComputedRef<number | undefined>;
  originalPrice: ComputedRef<number | undefined>;
  price: ComputedRef<number>;
  showOriginalPrice: ComputedRef<boolean>;
};

export function useProductPrice(product: Ref<Product>): UseProductPriceReturn {
  const originalPrice = computed(() => {
    const tierPrices = getProductTierPrices(product.value);
    return (
      (tierPrices.length && tierPrices?.[0]?.unitPrice) ||
      getProductCalculatedListingPrice(product.value)
    );
  });

  const price = computed(() => product.value.calculatedPrice?.totalPrice);

  const showOriginalPrice = computed(
    () => (price.value && (originalPrice?.value || 0)) > price.value
  );
  const fromPrice = computed(() => getProductFromPrice(product.value));

  return {
    fromPrice,
    showOriginalPrice,
    originalPrice,
    price,
  };
}
