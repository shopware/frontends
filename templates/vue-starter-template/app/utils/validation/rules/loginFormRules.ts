import { customValidators } from "@@/i18n/utils/i18n-validators";

export default function () {
  const { required, minLength, email } = customValidators();
  return {
    username: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(3),
    },
  };
}
