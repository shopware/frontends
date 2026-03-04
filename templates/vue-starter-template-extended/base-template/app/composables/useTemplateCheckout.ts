import { useRegle } from "@regle/core";
import type { Regle } from "@regle/core";
import type { Schemas } from "#shopware";
import { customValidators } from "../../i18n/utils/i18n-validators";

interface UseTemplateCheckoutReturn {
  selectedShippingMethod: Ref<string | null>;
  selectedPaymentMethod: Ref<string | null>;
  billingAddress: Ref<Omit<Schemas["CustomerAddress"], "id" | "customerId">>;
  canPlaceOrder: ComputedRef<boolean>;
  customerAddressRules: ComputedRef<object>;
  $vBillingAddress: Regle<
    Omit<Schemas["CustomerAddress"], "id" | "customerId">
  >["r$"];
  $vBaseInfo: Regle<{
    email: string;
    password: string;
  }>["r$"];
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

  const { r$: $vBillingAddress } = useRegle(
    billingAddress,
    customerAddressRules,
  );
  const { r$: $vBaseInfo } = useRegle(customerBaseInfo, baseInfoRules);

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
