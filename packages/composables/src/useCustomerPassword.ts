import { reactive } from "vue";
import type { UnwrapRef } from "vue";
import { useShopwareContext } from "#imports";
import type { RequestParameters } from "#shopware";
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
    updatePasswordData: RequestParameters<"changePassword">,
  ): Promise<boolean>;
  /**
   * Reset customer's password
   */
  resetPassword(
    resetPasswordData: RequestParameters<"sendRecoveryMail">,
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
    resetPasswordData: RequestParameters<"sendRecoveryMail">,
  ) {
    try {
      await apiClient.invoke(
        "sendRecoveryMail post /account/recovery-password",
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
