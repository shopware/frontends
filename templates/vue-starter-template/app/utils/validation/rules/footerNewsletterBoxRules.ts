import { customValidators } from "@@/i18n/utils/i18n-validators";

export default function () {
  const { required, email } = customValidators();
  return {
    email: {
      required,
      email,
    },
  };
}
