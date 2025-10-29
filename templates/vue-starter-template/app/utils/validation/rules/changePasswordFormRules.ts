import { customValidators } from "@@/i18n/utils/i18n-validators";
import type { operations } from "#shopware";

export function changePasswordFormRules(
  state: Ref<
    operations["changePassword post /account/change-password"]["body"]
  >,
) {
  const { required, minLength, sameAs } = customValidators();
  return {
    newPassword: {
      required,
      minLength: minLength(8),
    },
    newPasswordConfirm: {
      required,
      sameAs: sameAs(computed(() => state.value.newPassword)),
    },
    password: {
      required,
    },
  };
}
