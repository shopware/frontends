import { customValidators } from "@@/i18n/utils/i18n-validators";
import { type Ref, computed } from "vue";
import type { Schemas } from "#shopware";

export function addressFormRules(
  state: Ref<Omit<Schemas["CustomerAddress"], "id" | "customerId">>,
) {
  const { required, minLength, requiredIf } = customValidators();
  const { getStatesForCountry } = useCountries();

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
        return !!getStatesForCountry(state.value.countryId)?.length;
      }),
    },
  }));
}
