import type { Schemas } from "#shopware";
import { useCart, useNotifications } from "#imports";

const successCodes = ["promotion-discount-added"];

export type useCartNotificationReturn = {
  codeErrorsNotification(): void;
  getErrorsCodes(): Schemas["CartError"][];
};

/**
 * UI composable
 *
 * @category Cart & Checkout
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

    for (const element of Object.keys(errors)) {
      if (successCodes.includes(errors[element].messageKey)) {
        pushSuccess(errors[element].message);
      } else {
        pushError(errors[element].message);
      }
    }
  };

  /**
   * Get errors codes without displaying
   *
   * @returns CartError[] | undefined
   */
  const getErrorsCodes = () => {
    const errors: Schemas["Cart"]["errors"] = consumeCartErrors();
    if (!errors || Array.isArray(errors)) return [];

    return Object.keys(errors).reduce(
      (acc, element) => {
        if (!successCodes.includes(errors[element].messageKey))
          acc.push(errors[element] as Schemas["CartError"]);

        return acc;
      },
      [] as Schemas["CartError"][],
    );
  };

  return {
    codeErrorsNotification,
    getErrorsCodes,
  };
}
