import { customValidators, requiredIf } from "@@/i18n/utils/i18n-validators";
import { computed, Ref } from "vue";

export default function (accountType: Ref<string>) {
  const { required } = customValidators();
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
