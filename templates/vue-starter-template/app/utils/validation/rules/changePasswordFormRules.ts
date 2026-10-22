import { customValidators } from "#imports";
import type { operations } from "#shopware";

export function changePasswordFormRules(
  state: Ref<
    operations["changePassword post /account/change-password"]["body"]
  >,
) {
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
    password: {
      required,
    },
  };
}
