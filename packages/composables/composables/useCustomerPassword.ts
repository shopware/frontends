import { UnwrapRef, reactive } from "vue";
import {
  updatePassword as apiUpdatePassword,
  resetPassword as apiResetPassword,
  CustomerUpdatePasswordParam,
  CustomerResetPasswordParam,
} from "@shopware-pwa/api-client";
import { ClientApiError, ShopwareError } from "@shopware-pwa/types";

export type UseCustomerPasswordReturn = {
  errors: UnwrapRef<{
    resetPassword: ShopwareError[];
    updatePassword: ShopwareError[];
  }>;
  /**
   * Change customer's current password
   */
  updatePassword(
    updatePasswordData: CustomerUpdatePasswordParam,
  ): Promise<boolean>;
  /**
   * Reset customer's password
   */
  resetPassword(
    resetPasswordData: CustomerResetPasswordParam,
  ): Promise<boolean>;
};

/**
 * Composable for customer password management.
 * @public
 * @category Customer & Account
 */
export function useCustomerPassword(): UseCustomerPasswordReturn {
  const { apiInstance } = useShopwareContext();

  const errors: UnwrapRef<{
    resetPassword: ShopwareError[];
    updatePassword: ShopwareError[];
  }> = reactive({
    resetPassword: [],
    updatePassword: [],
  });

  async function updatePassword(
    updatePasswordData: CustomerUpdatePasswordParam,
  ) {
    try {
      errors.updatePassword = [];
      await apiUpdatePassword(updatePasswordData, apiInstance);
    } catch (e) {
      errors.updatePassword = (e as ClientApiError).messages;
      return false;
    }
    return true;
  }

  async function resetPassword(resetPasswordData: CustomerResetPasswordParam) {
    try {
      await apiResetPassword(resetPasswordData, apiInstance);
    } catch (e) {
      errors.resetPassword = (e as ClientApiError).messages;
      return false;
    }
    return true;
  }

  return {
    updatePassword,
    resetPassword,
    errors,
  };
}
