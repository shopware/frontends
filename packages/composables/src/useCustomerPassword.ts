import { reactive } from "vue";
import type { UnwrapRef } from "vue";
import type { ShopwareError } from "@shopware-pwa/types";
import { useShopwareContext } from "#imports";
import { RequestParameters } from "#shopware";
import { ApiClientError } from "@shopware/api-client";

export type UseCustomerPasswordReturn = {
  errors: UnwrapRef<{
    resetPassword: ShopwareError[];
    updatePassword: ShopwareError[];
  }>;
  /**
   * Change customer's current password
   */
  updatePassword(
    updatePasswordData: RequestParameters<"changePassword">,
  ): Promise<boolean>;
  /**
   * Reset customer's password
   */
  resetPassword(
    resetPasswordData: RequestParameters<"recoveryPassword">,
  ): Promise<boolean>;
};

/**
 * Composable for customer password management.
 * @public
 * @category Customer & Account
 */
export function useCustomerPassword(): UseCustomerPasswordReturn {
  const { apiClient } = useShopwareContext();

  const errors: UnwrapRef<{
    resetPassword: ShopwareError[];
    updatePassword: ShopwareError[];
  }> = reactive({
    resetPassword: [],
    updatePassword: [],
  });

  async function updatePassword(
    updatePasswordData: RequestParameters<"changePassword">,
  ) {
    try {
      errors.updatePassword = [];
      await apiClient.invoke(
        "changePassword post /account/change-password",
        updatePasswordData,
      );
    } catch (e) {
      if (e instanceof ApiClientError) {
        errors.updatePassword = e.details;
      }
      return false;
    }
    return true;
  }

  async function resetPassword(
    resetPasswordData: RequestParameters<"recoveryPassword">,
  ) {
    try {
      await apiClient.invoke(
        "recoveryPassword post /account/recovery-password-confirm",
        resetPasswordData,
      );
    } catch (e) {
      if (e instanceof ApiClientError) {
        errors.resetPassword = e.details;
      }
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
