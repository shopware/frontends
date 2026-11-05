import { customValidators } from "#imports";

/** Rules for a new password and its confirmation, shared by change and reset. */
export function newPasswordFormRules(state: Ref<{ newPassword: string }>) {
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
