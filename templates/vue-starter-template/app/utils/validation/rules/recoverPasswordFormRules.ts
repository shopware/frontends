import { customValidators } from "#imports";

export function recoverPasswordFormRules() {
  const { required, email } = customValidators();
  return {
    email: {
      required,
      email,
    },
  };
}
