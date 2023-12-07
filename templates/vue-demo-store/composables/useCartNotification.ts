import type { Schemas } from "#shopware";
import type { CartError } from "@shopware-pwa/types";

const successCodes = ["promotion-discount-added"];

export type useCartNotificationReturn = {
  codeErrorsNotification(): void;
  getErrorsCodes(): CartError[];
};

/**
 * UI composable
 *
 * @returns
 */
export function useCartNotification(): useCartNotificationReturn {
  const { pushError, pushSuccess } = useNotifications();
  const { consumeCartErrors } = useCart();

  /**
   * Get cart error and display
   *
   * @returns {void}
   */
  const codeErrorsNotification = () => {
    const errors: Schemas["Cart"]["errors"] = consumeCartErrors();
    if (!errors || Array.isArray(errors)) return;

    Object.keys(errors).forEach((element) => {
      if (successCodes.includes(errors[element].messageKey)) {
        pushSuccess(errors[element].message);
      } else {
        pushError(errors[element].message);
      }
    });
  };

  /**
   * Get errors codes without displaying
   *
   * @returns CartError[] | undefined
   */
  const getErrorsCodes = () => {
    const errors: Schemas["Cart"]["errors"] = consumeCartErrors();
    if (!errors || Array.isArray(errors)) return [];

    return Object.keys(errors).reduce((acc, element) => {
      if (!successCodes.includes(errors[element].messageKey))
        acc.push(errors[element]);

      return acc;
    }, [] as CartError[]);
  };

  return {
    codeErrorsNotification,
    getErrorsCodes,
  };
}
