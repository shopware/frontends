import { CartErrors } from "@shopware-pwa/types";

const successCodes = ["promotion-discount-added"];

export type UseCmsHeadReturn = {
  codeErrorsNotification(): void;
};

/**
 * UI composable
 *
 * @returns
 */
export function useCartNotification() {
  const { pushError, pushSuccess } = useNotifications();
  const { consumeCartErrors } = useCart();

  /**
   * Get cart error and display
   *
   * @returns {void}
   */
  const codeErrorsNotification = () => {
    const errors: CartErrors | null = consumeCartErrors();
    if (!errors) return;

    Object.keys(errors).forEach((element) => {
      if (successCodes.includes(errors[element].messageKey)) {
        pushSuccess(errors[element].message);
      } else {
        pushError(errors[element].message);
      }
    });
  };

  return {
    codeErrorsNotification,
  };
}
