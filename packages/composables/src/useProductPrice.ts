import {
  getProductCalculatedListingPrice,
  getProductFromPrice,
  getProductTierPrices,
} from "@shopware-pwa/helpers-next";
import { Product } from "@shopware-pwa/types";
import { computed, ComputedRef } from "vue";

export type UseProductPriceReturn = {
  fromPrice: ComputedRef<number | undefined>;
  originalPrice: ComputedRef<number | undefined>;
  price: ComputedRef<number>;
  showOriginalPrice: ComputedRef<boolean>;
};

export function useProductPrice(product: Product): UseProductPriceReturn {
  const originalPrice = computed(() => {
    const tierPrices = getProductTierPrices(product);
    return (
      (tierPrices.length && tierPrices?.[0]?.unitPrice) ||
      getProductCalculatedListingPrice(product)
    );
  });

  const price = computed(() => product.calculatedPrice?.totalPrice);

  const showOriginalPrice = computed(
    () => (price.value && (originalPrice?.value || 0)) > price.value
  );
  const fromPrice = computed(() => getProductFromPrice(product));

  return {
    fromPrice,
    showOriginalPrice,
    originalPrice,
    price,
  };
}
