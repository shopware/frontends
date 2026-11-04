import type { operations } from "#shopware";

export type ResetPasswordFormState = Omit<
  operations["recoveryPassword post /account/recovery-password-confirm"]["body"],
  "hash"
>;

export function resetPasswordFormRules(state: Ref<ResetPasswordFormState>) {
  return newPasswordFormRules(state);
}
