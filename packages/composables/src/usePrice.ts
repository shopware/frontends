import { ref } from "vue";

const currencySymbol = ref<string>("");
const currencyPosition = ref<number>(1);

// @ToDo make sure why there is no decimal precision in api response
const decimalPrecision = 2;

export type InitOptions = {
  currencySymbol: string;
  currencyPosition: number;
};

/**
 * interface for {@link usePrice} composable
 * @beta
 */
export interface UsePrice {
  init: (options: InitOptions) => void;
  getFormattedPrice: (value: number | string) => string;
}

/**
 * Price - {@link UsePrice}
 * @beta
 */
export function usePrice(): UsePrice {
  /**
   * Set init data from backend response
   *
   * @param options
   */
  const init = (options: InitOptions): void => {
    setCurrencySymbol(options.currencySymbol);
    setCurrencyPosition(options.currencyPosition);
  };

  const setCurrencySymbol = (symbol: string) => {
    currencySymbol.value = symbol;
  };

  const setCurrencyPosition = (position: number) => {
    currencyPosition.value = position;
  };

  /**
   * Format price (2) -> 2.00 $
   */
  const getFormattedPrice = (value: number | string): string => {
    let formattedPrice = [
      (+value).toFixed(decimalPrecision),
      currencySymbol.value,
    ];

    if (currencyPosition.value === 0) {
      formattedPrice = formattedPrice.reverse();
    }

    return formattedPrice.join(" ");
  };

  return {
    init,
    getFormattedPrice,
  };
}
