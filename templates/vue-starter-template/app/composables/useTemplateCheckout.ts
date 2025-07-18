import { useVuelidate } from "@vuelidate/core";
import type { Schemas } from "#shopware";
import { customValidators } from "../../i18n/utils/i18n-validators";

interface UseTemplateCheckoutReturn {
  selectedShippingMethod: Ref<string | null>;
  selectedPaymentMethod: Ref<string | null>;
  billingAddress: Ref<Omit<Schemas["CustomerAddress"], "id" | "customerId">>;
  canPlaceOrder: ComputedRef<boolean>;
  customerAddressRules: ComputedRef<object>;
  $vBillingAddress: ReturnType<typeof useVuelidate>;
  $vBaseInfo: ReturnType<typeof useVuelidate>;
  customerBaseInfo: Ref<{
    email: string;
    password: string;
  }>;
}

export function useTemplateCheckout(): UseTemplateCheckoutReturn {
  const { required, minLength, email } = customValidators();

  const selectedShippingMethod = ref<string | null>(null);
  const selectedPaymentMethod = ref<string | null>(null);

  const billingAddress = ref<
    Omit<Schemas["CustomerAddress"], "id" | "customerId">
  >({
    firstName: "",
    lastName: "",
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
  });

  const customerBaseInfo = ref<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const canPlaceOrder = computed(
    () => !!(selectedShippingMethod.value && selectedPaymentMethod.value),
  );

  const customerAddressRules = computed(() => ({
    firstName: {
      required,
      minLength: minLength(3),
    },
    lastName: {
      required,
      minLength: minLength(3),
    },
    street: {
      required,
      minLength: minLength(3),
    },
    city: {
      required,
    },
    countryId: {
      required,
    },
  }));

  const baseInfoRules = computed(() => ({
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(3),
    },
  }));

  const $vBillingAddress = useVuelidate(customerAddressRules, billingAddress);
  const $vBaseInfo = useVuelidate(baseInfoRules, customerBaseInfo);

  return {
    selectedShippingMethod,
    selectedPaymentMethod,
    billingAddress,
    canPlaceOrder,
    customerAddressRules,
    $vBillingAddress,
    $vBaseInfo,
    customerBaseInfo,
  };
}
