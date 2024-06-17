import { useShopwareContext } from "#imports";
import type { operations } from "#shopware";

export type UseCustomerPasswordReturn = {
  /**
   * Change customer's current password
   */
  updatePassword(
    updatePasswordData: operations["changePassword post /account/change-password"]["body"],
  ): Promise<
    operations["changePassword post /account/change-password"]["response"]
  >;
  /**
   * Reset customer's password
   */
  resetPassword(
    resetPasswordData: operations["sendRecoveryMail post /account/recovery-password"]["body"],
  ): Promise<
    operations["sendRecoveryMail post /account/recovery-password"]["response"]
  >;
};

/**
 * Composable for customer password management.
 * @public
 * @category Customer & Account
 */
export function useCustomerPassword(): UseCustomerPasswordReturn {
  const { apiClient } = useShopwareContext();

  async function updatePassword(
    updatePasswordData: operations["changePassword post /account/change-password"]["body"],
  ) {
    const response = await apiClient.invoke(
      "changePassword post /account/change-password",
      {
        body: updatePasswordData,
      },
    );
    return response.data;
  }

  async function resetPassword(
    resetPasswordData: operations["sendRecoveryMail post /account/recovery-password"]["body"],
  ) {
    const response = await apiClient.invoke(
      "sendRecoveryMail post /account/recovery-password",
      { body: resetPasswordData },
    );
    return response.data;
  }

  return {
    updatePassword,
    resetPassword,
  };
}
