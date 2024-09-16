import { computed, ref, watch } from "vue";
import type { ComputedRef } from "vue";
import { createSharedComposable } from "@vueuse/core";
import { useSessionContext } from "#imports";

export type UsePriceReturn = {
  /**
   * Format price i.e. (2) -> 2.00 $
   */
  getFormattedPrice(value: number | string | undefined): string;
  /**
   * Update configuration
   */
  update(params: {
    localeCode: string | undefined;
    currencyCode: string;
  }): void;
  /**
   * Currency code
   */
  currencyCode: ComputedRef<string>;
};

/**
 * Composable for getting formatted price
 * Set the default currency code and locale in order to format a price correctly
 *
 * @public
 * @category Product
 */
function _usePrice(params?: {
  localeCode: string | undefined;
  currencyCode: string;
}): UsePriceReturn {
  const { sessionContext } = useSessionContext();
  const currencyLocale = ref<string | undefined>();
  const currencyCode = ref<string>("");

  if (params) {
    currencyCode.value = params.currencyCode;
    currencyLocale.value = params.localeCode;
  }

  function update(params: {
    localeCode?: string | undefined;
    currencyCode: string;
  }) {
    _setCurrencyCode(params.currencyCode);
    _setLocaleCode(
      params.localeCode ||
        currencyLocale.value ||
        (typeof navigator !== "undefined" && navigator?.language) ||
        "en-US",
    );
  }

  function _setCurrencyCode(code: string) {
    currencyCode.value = code;
  }

  function _setLocaleCode(locale: string) {
    currencyLocale.value = locale;
  }

  /**
   * Format price (2) -> $ 2.00
   */
  function getFormattedPrice(value: number | string | undefined): string {
    if (typeof value === "undefined") {
      return "";
    }

    if (!currencyLocale.value) {
      return value.toString();
    }

    return new Intl.NumberFormat(currencyLocale.value, {
      style: "currency",
      currency: currencyCode.value,
    }).format(+value);
  }

  watch(
    () => sessionContext.value?.currency,
    (newCurrency) => {
      if (newCurrency)
        update({
          // locale code is read only once on SSR because it's unavailable in the context
          currencyCode: newCurrency?.isoCode,
        });
    },
    {
      immediate: true,
    },
  );

  return {
    getFormattedPrice,
    update,
    currencyCode: computed(() => currencyCode.value),
  };
}
/**
 * @category Product
 */
export const usePrice = createSharedComposable(_usePrice);
