import { useCart, useNotifications } from "#imports";
import type { Schemas } from "#shopware";

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
      const error = errors[element] as Schemas["CartError"];
      if (successCodes.includes(error.messageKey)) {
        pushSuccess(error.message);
      } else {
        pushError(error.message);
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
        const error = errors[element] as Schemas["CartError"];
        if (!successCodes.includes(error.messageKey)) acc.push(error);
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
