import { customValidators } from "@@/i18n/utils/i18n-validators";
import { computed } from "vue";

export default function () {
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
      required: requiredIf(() => state.accountType === "business"),
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
        return !!getStatesForCountry(state.billingAddress.countryId)?.length;
      }),
    },
  },
}));
}

