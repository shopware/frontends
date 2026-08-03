import { type Ref, computed } from "vue";

import { customValidators } from "#imports";

export function registrationFormRules(
  accountType: Ref<string>,
  countryId: Ref<string>,
  countryHasStates: Ref<boolean>,
) {
  const { required, minLength, email, requiredIf } = customValidators();

  return computed(() => ({
    accountType: {
      required,
    },
    firstName: {
      required,
      minLength: minLength(3),
    },
    lastName: {
      required,
      minLength: minLength(3),
    },
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(8),
    },
    billingAddress: {
      company: {
        required: requiredIf(() => unref(accountType) === "business"),
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
          return !!unref(countryId) && countryHasStates.value;
        }),
      },
    },
  }));
}
