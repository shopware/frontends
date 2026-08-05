import { createSharedComposable } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import type { ComputedRef } from "vue";

import { useSessionContext, useShopwareContext } from "#imports";

export type UsePriceReturn = {
  /**
   * Format price i.e. (2) -> 2.00 $
   */
  getFormattedPrice(value: number | string | undefined): string;
  /**
   * Update configuration
   */
  update(params: {
    localeCode?: string | undefined;
    currencyCode: string;
  }): void;
  /**
   * Currency code
   */
  currencyCode: ComputedRef<string>;
  /**
   * Currency locale
   */
  currencyLocale: ComputedRef<string>;
};

/**
 * Composable for getting formatted price
 *
 * Prices are formatted in the shop's display language, taken from the session
 * context (`languageInfo.localeCode`). That keeps numbers consistent with the
 * page copy, keeps server and client output identical, and lets `Intl` pick the
 * currency representation - a native symbol where the locale has one, an
 * unambiguous ISO code or a disambiguated prefix (`CA$`, `US$`) where it does not.
 *
 * Pass `localeCode` to format in a different locale instead. Because this is a
 * shared composable, only the first call's params take effect; use `update()`
 * afterwards.
 *
 * @public
 * @category Product
 */
function _usePrice(params?: {
  localeCode?: string | undefined;
  currencyCode: string;
}): UsePriceReturn {
  const { sessionContext, currentLocaleCode } = useSessionContext();
  const { browserLocale } = useShopwareContext();
  const currencyCode = ref<string>(params?.currencyCode ?? "");
  const currencyLocale = ref<string>(params?.localeCode || browserLocale);
  // A locale given by the consumer outranks the shop locale from the session context.
  let localeCodeIsExplicit = Boolean(params?.localeCode);

  function update(params: {
    localeCode?: string | undefined;
    currencyCode: string;
  }) {
    if (params.localeCode) {
      localeCodeIsExplicit = true;
    }
    _setCurrencyCode(params.currencyCode);
    _setLocaleCode(params.localeCode);
  }

  function _setCurrencyCode(code: string) {
    currencyCode.value = code;
  }

  function _setLocaleCode(locale: string | undefined) {
    currencyLocale.value = locale || currencyLocale.value;
  }

  /**
   * Building a formatter costs ~60x more than using one, so it is cached until
   * the locale or the currency changes. A locale that `Intl` rejects falls back
   * to the browser locale rather than dropping the currency from the output.
   */
  const formatter = computed<Intl.NumberFormat | null>(() => {
    if (!currencyCode.value) {
      return null;
    }
    for (const locale of [currencyLocale.value, browserLocale]) {
      if (!locale) continue;
      try {
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency: currencyCode.value,
        });
      } catch {
        // invalid locale or currency code, try the next candidate
      }
    }
    return null;
  });

  /**
   * Format price (2) -> $ 2.00
   */
  function getFormattedPrice(value: number | string | undefined): string {
    if (typeof value === "undefined") {
      return "";
    }

    if (!formatter.value) {
      return value.toString();
    }
    return formatter.value.format(+value);
  }

  watch(
    [() => sessionContext.value?.currency, () => currentLocaleCode?.value],
    ([newCurrency, newLocaleCode]) => {
      if (newCurrency) {
        _setCurrencyCode(newCurrency.isoCode);
      }
      if (newLocaleCode && !localeCodeIsExplicit) {
        _setLocaleCode(newLocaleCode);
      }
    },
    {
      immediate: true,
    },
  );

  return {
    getFormattedPrice,
    update,
    currencyCode: computed(() => currencyCode.value),
    currencyLocale: computed(() => currencyLocale.value),
  };
}
/**
 * @category Product
 */
export const usePrice = createSharedComposable(_usePrice);
