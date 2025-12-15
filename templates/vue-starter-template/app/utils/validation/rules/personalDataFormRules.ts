import { type Ref, computed } from "vue";
import { customValidators } from "#imports";

export function personalDataFormRules(accountType: Ref<string>) {
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
