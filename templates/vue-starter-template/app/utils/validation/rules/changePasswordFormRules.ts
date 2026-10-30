import { customValidators } from "#imports";
import type { operations } from "#shopware";

export function changePasswordFormRules(
  state: Ref<
    operations["changePassword post /account/change-password"]["body"]
  >,
) {
  const { required } = customValidators();
  return {
    ...newPasswordFormRules(state),
    password: {
      required,
    },
  };
}
