import { ref } from "vue";

const currencyLocale = ref<string>("");
const currencyCode = ref<string>("");

// @ToDo make sure why there is no decimal precision in api response
const decimalPrecision = 2;

export type UsePriceReturn = {
  /**
   * Set init data: localeCode & currencyCode
   */
  init(options: { localeCode: string | undefined; currencyCode: string }): void;
  /**
   * Format price i.e. (2) -> 2.00 $
   */
  getFormattedPrice(value: number | string | undefined): string;
};

/**
 * Composable for getting formatted price
 * @public
 * @category Product
 */
export function usePrice(): UsePriceReturn {
  /**
   * Set init data from backend response
   *
   * as a fallback for params.localeCode is navigator?.language
   * @param params
   */
  function init(params: {
    localeCode: string | undefined;
    currencyCode: string;
  }): void {
    _setCurrencyCode(params.currencyCode);
    _setLocaleCode(params.localeCode || navigator?.language);
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

    if (typeof Intl === "undefined" || !currencyLocale.value) {
      return value.toString();
    }

    return new Intl.NumberFormat(currencyLocale.value, {
      style: "currency",
      currency: currencyCode.value,
    }).format(+value);
  }

  return {
    init,
    getFormattedPrice,
  };
}
