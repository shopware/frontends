import { ref } from "vue";

const currencySymbol = ref<string>("");
const currencyPosition = ref<number>(1);

// @ToDo make sure why there is no decimal precision in api response
const decimalPrecision = 2;

export type UsePriceReturn = {
  init: (options: { currencySymbol: string; currencyPosition: number }) => void;
  getFormattedPrice: (value: number | string) => string;
};

export function usePrice(): UsePriceReturn {
  /**
   * Set init data from backend response
   *
   * @param params
   */
  function init(params: {
    currencySymbol: string;
    currencyPosition: number;
  }): void {
    _setCurrencySymbol(params.currencySymbol);
    _setCurrencyPosition(params.currencyPosition);
  }

  function _setCurrencySymbol(symbol: string) {
    currencySymbol.value = symbol;
  }

  function _setCurrencyPosition(position: number) {
    currencyPosition.value = position;
  }

  /**
   * Format price (2) -> 2.00 $
   */
  function getFormattedPrice(value: number | string): string {
    let formattedPrice = [
      (+value).toFixed(decimalPrecision),
      currencySymbol.value,
    ];

    if (currencyPosition.value === 0) {
      formattedPrice = formattedPrice.reverse();
    }

    return formattedPrice.join(" ");
  }

  return {
    init,
    getFormattedPrice,
  };
}
