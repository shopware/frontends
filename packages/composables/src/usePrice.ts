import { ref, watch } from "vue";
import { createSharedComposable } from "@vueuse/core";
import { useSessionContext } from "./useSessionContext";

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
};

/**
 * Composable for getting formatted price
 * Set the default currency code and locale in order to format a price correctly
 *
 * @public
 * @category Product
 */
function _usePrice(params: {
  localeCode: string | undefined;
  currencyCode: string;
}): UsePriceReturn {
  const { sessionContext } = useSessionContext();
  const currencyLocale = ref<string | undefined>(params.localeCode);
  const currencyCode = ref<string>(params.currencyCode);

  function update(params: {
    localeCode?: string | undefined;
    currencyCode: string;
  }) {
    _setCurrencyCode(params.currencyCode);
    _setLocaleCode(
      params.localeCode ||
        currencyLocale.value ||
        (typeof navigator !== "undefined" && navigator?.language) ||
        "en-US"
    );
  }

  // TODO: make sure why there is no decimal precision in api response
  const decimalPrecision = 2;

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
      update({
        // locale code is read only once on SSR because it's unavailable in the context
        currencyCode: newCurrency?.isoCode as string,
      });
    },
    {
      immediate: true,
    }
  );

  return {
    getFormattedPrice,
    update,
  };
}

export const usePrice = createSharedComposable(_usePrice);
