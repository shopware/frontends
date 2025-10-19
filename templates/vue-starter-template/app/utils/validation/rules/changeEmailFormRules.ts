import { customValidators } from "@@/i18n/utils/i18n-validators";
import type { operations } from "#shopware";

export function changeEmailFormRules(
  state: Ref<operations["changeEmail post /account/change-email"]["body"]>,
) {
  const { required, email, sameAs } = customValidators();
  return {
    email: {
      required,
      email,
    },
    emailConfirmation: {
      required,
      sameAs: sameAs(computed(() => state.value.email)),
    },
    password: {
      required,
    },
  };
}
