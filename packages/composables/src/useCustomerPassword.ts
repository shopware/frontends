import { reactive } from "vue";
import type { UnwrapRef } from "vue";
import { useShopwareContext } from "#imports";
import type { operations } from "#shopware";
import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";

export type UseCustomerPasswordReturn = {
  errors: UnwrapRef<{
    resetPassword: ApiError[];
    updatePassword: ApiError[];
  }>;
  /**
   * Change customer's current password
   */
  updatePassword(
    updatePasswordData: operations["changePassword post /account/change-password"]["body"],
  ): Promise<boolean>;
  /**
   * Reset customer's password
   */
  resetPassword(
    resetPasswordData: operations["sendRecoveryMail post /account/recovery-password"]["body"],
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
    resetPassword: ApiError[];
    updatePassword: ApiError[];
  }> = reactive({
    resetPassword: [],
    updatePassword: [],
  });

  async function updatePassword(
    updatePasswordData: operations["changePassword post /account/change-password"]["body"],
  ) {
    try {
      errors.updatePassword = [];
      await apiClient.invoke("changePassword post /account/change-password", {
        body: updatePasswordData,
      });
    } catch (e) {
      if (e instanceof ApiClientError) {
        errors.updatePassword = e.details;
      }
      return false;
    }
    return true;
  }

  async function resetPassword(
    resetPasswordData: operations["sendRecoveryMail post /account/recovery-password"]["body"],
  ) {
    try {
      await apiClient.invoke(
        "sendRecoveryMail post /account/recovery-password",
        { body: resetPasswordData },
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
