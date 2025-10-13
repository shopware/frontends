import { customValidators } from "@@/i18n/utils/i18n-validators";
import { type Ref, computed } from "vue";

export function registrationFormRules(
  accountType: Ref<string>,
  countryId: Ref<string>,
) {
  const { required, minLength, email, requiredIf } = customValidators();
  const { getStatesForCountry } = useCountries();

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
          return !!getStatesForCountry(unref(countryId))?.length;
        }),
      },
    },
  }));
}
