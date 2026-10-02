import { customValidators } from "#imports";
import type { operations } from "#shopware";

export type ResetPasswordFormState = Omit<
  operations["recoveryPassword post /account/recovery-password-confirm"]["body"],
  "hash"
>;

export function resetPasswordFormRules(state: Ref<ResetPasswordFormState>) {
  const { required, minLength, sameAsPassword } = customValidators();
  return {
    newPassword: {
      required,
      minLength: minLength(8),
    },
    newPasswordConfirm: {
      required,
      sameAs: sameAsPassword(computed(() => state.value.newPassword)),
    },
  };
}
