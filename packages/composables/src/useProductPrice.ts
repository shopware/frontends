import type { Schemas } from "#shopware";
import { getProductTierPrices } from "@shopware-pwa/helpers-next";
import type { TierPrice } from "@shopware-pwa/helpers-next";
import { computed } from "vue";
import type { ComputedRef, Ref } from "vue";

export type UseProductPriceReturn = {
  /**
   * Whole calculated price object
   */
  price: ComputedRef<Schemas["CalculatedPrice"] | undefined>;
  /**
   * Calculated price value for one selling unit
   */
  totalPrice: ComputedRef<number | undefined>;
  /**
   * Current unit price value
   */
  unitPrice: ComputedRef<number | undefined>;
  /**
   * Can be used if isListPrice is set to true
   */
  referencePrice: ComputedRef<Schemas["CalculatedPrice"] | undefined>;
  /**
   * determines if `price` contains the minimum tier price
   */
  displayFrom: ComputedRef<boolean>;
  /**
   * cheapest price value for a variant if exists
   */
  displayFromVariants: ComputedRef<number | false | undefined>;
  /**
   * array of TierPrice object
   */
  tierPrices: ComputedRef<TierPrice[]>;
  /**
   * determines whether a discount price is set
   */
  isListPrice: ComputedRef<boolean>;
};

/**
 * The purpose of the `useProductPrice` function is to abstract the logic to expose most useful helpers for price displaying.
 *
 * @public
 * @category Product
 */
export function useProductPrice(
  product: Ref<Schemas["Product"]>,
): UseProductPriceReturn {
  const _cheapest: ComputedRef<Schemas["CalculatedPrice"] | undefined> =
    computed(() => product.value?.calculatedCheapestPrice);

  /**
   * calculatedPrices are used for product with tier prices
   */
  const _real: ComputedRef<Schemas["CalculatedPrice"] | undefined> = computed(
    () =>
      (product.value?.calculatedPrices?.length ?? 0) > 0
        ? product.value?.calculatedPrices?.[0]
        : product.value?.calculatedPrice,
  );
  const referencePrice: ComputedRef<Schemas["CalculatedPrice"] | undefined> =
    computed(() => _real?.value?.referencePrice);

  const _displayParent: ComputedRef<boolean> = computed(
    () =>
      !!product.value?.variantListingConfig?.displayParent &&
      product.value?.parentId === null,
  );

  const displayFrom: ComputedRef<boolean> = computed(
    () =>
      (product.value?.calculatedPrices?.length ?? 0) > 1 ||
      !!(_displayParent.value && displayFromVariants.value),
  );

  const displayFromVariants: ComputedRef<number | false | undefined> = computed(
    () =>
      !!product.value.parentId &&
      product.value?.calculatedCheapestPrice?.hasRange &&
      _real?.value?.unitPrice !== _cheapest?.value?.unitPrice &&
      _cheapest?.value?.unitPrice,
  );

  const _price: ComputedRef<Schemas["CalculatedPrice"] | undefined> = computed(
    () => {
      if (displayFrom.value && getProductTierPrices(product.value).length > 1) {
        const lowest = product.value?.calculatedPrices?.reduce(
          (previous, current) => {
            return current.unitPrice < previous.unitPrice ? current : previous;
          },
        );
        return lowest || _cheapest.value;
      }
      return _real.value;
    },
  );

  const unitPrice: ComputedRef<number | undefined> = computed(
    () => _price.value?.unitPrice,
  );
  const totalPrice: ComputedRef<number | undefined> = computed(
    () => _price.value?.totalPrice,
  );
  const price: ComputedRef<Schemas["CalculatedPrice"] | undefined> = computed(
    () => _price.value,
  );

  const isListPrice: ComputedRef<boolean> = computed(
    () => !!_price.value?.listPrice?.percentage,
  );

  const tierPrices = computed(() => getProductTierPrices(product.value));

  return {
    price,
    totalPrice,
    unitPrice,
    displayFromVariants,
    displayFrom,
    tierPrices,
    referencePrice,
    isListPrice,
  };
}
