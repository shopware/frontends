import { CartErrors } from "@shopware-pwa/types";

const promotionCodeAddedKey = "promotion-discount-added";

export type UseCmsHeadReturn = {
  promotionCodeNotification(errors: CartErrors): void;
};

export function useCartNotification() {
  const { pushError, pushSuccess } = useNotifications();

  const promotionCodeNotification = (errors: CartErrors) => {
    Object.keys(errors).forEach((element) => {
      if (errors[element].messageKey === promotionCodeAddedKey) {
        pushSuccess(errors[element].message);
      } else {
        pushError(errors[element].message);
      }
    });
  };

  return {
    promotionCodeNotification,
  };
}
