/**
 * To have formatting with backend options
 * please use usePrice composable
 */
const toFixedValue = 2;
const decimalsRegExp = new RegExp(`[.,]0{${toFixedValue}}$`);

function removeDecimals(value: string) {
  return value.replace(decimalsRegExp, "");
}

type Options = {
  direction?: "ltr" | "rtl";
  removeDecimals?: boolean;
  removeCurrency?: boolean;
};

/**
 * Get formatted price
 *
 * @param value price value
 * @param currency currency symbol
 * @param options formatting options (direction, removeDecimals, removeCurrency)
 *
 * @public
 */
export function getFormattedPrice(
  value: string | number,
  currency: string,
  options: Options = {
    direction: "ltr",
    removeDecimals: false,
    removeCurrency: false,
  },
): string {
  let formattedPrice = [(+value).toFixed(toFixedValue), currency];

  // Remove decimals
  // 1.00 -> 1 | 1.02  -> 1.02
  if (options.removeDecimals) {
    formattedPrice[0] = removeDecimals(formattedPrice[0] as string);
  }
  // Remove currency
  // 1 $ -> 1
  if (options.removeCurrency) {
    formattedPrice.pop();
  }

  // Change currency position
  // 1 $ -> $ 1
  if (options.direction === "rtl" && !options.removeCurrency) {
    formattedPrice = formattedPrice.reverse();
  }

  return formattedPrice.join(" ");
}
