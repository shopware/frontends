import { customValidators } from "#imports";

export function footerNewsletterBoxRules() {
  const { required, email } = customValidators();
  return {
    email: {
      required,
      email,
    },
  };
}
