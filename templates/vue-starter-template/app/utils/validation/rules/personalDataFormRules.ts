import { customValidators } from "@@/i18n/utils/i18n-validators";
import { type Ref, computed } from "vue";

export default function (accountType: Ref<string>) {
  const { required, requiredIf } = customValidators();
  return computed(() => ({
    firstName: {
      required,
    },
    lastName: {
      required,
    },
    accountType: {
      required,
    },
    company: {
      required: requiredIf(() => {
        return accountType.value === "business";
      }),
    },
    vatIds: {
      required: requiredIf(() => {
        return accountType.value === "business";
      }),
    },
  }));
}
