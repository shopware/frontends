import { type Ref, computed } from "vue";

import { customValidators } from "#imports";
export function addressFormRules(countryHasStates: Ref<boolean>) {
  const { required, minLength, requiredIf } = customValidators();

  return computed(() => ({
    salutationId: {
      required,
    },
    firstName: {
      required,
      minLength: minLength(2),
    },
    lastName: {
      required,
      minLength: minLength(2),
    },
    street: {
      required,
      minLength: minLength(3),
    },
    zipcode: {
      required,
    },
    city: {
      required,
    },
    countryId: {
      required,
    },
    countryStateId: {
      required: requiredIf(() => {
        return countryHasStates.value;
      }),
    },
  }));
}
