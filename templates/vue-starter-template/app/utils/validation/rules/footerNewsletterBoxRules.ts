import { customValidators } from "@@/i18n/utils/i18n-validators";

export function footerNewsletterBoxRules() {
  const { required, email } = customValidators();
  return {
    email: {
      required,
      email,
    },
  };
}
