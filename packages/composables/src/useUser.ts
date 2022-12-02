import { ref, Ref, UnwrapRef, computed, ComputedRef, reactive } from "vue";
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  updateEmail as apiUpdateEmail,
  getCustomer,
  getUserCountry,
  getUserSalutation,
  updateProfile,
  CustomerUpdateProfileParam,
  CustomerUpdateEmailParam,
  setDefaultCustomerPaymentMethod,
} from "@shopware-pwa/api-client";
import {
  Customer,
  CustomerRegistrationParams,
  Country,
  Salutation,
  ShopwareSearchParams,
  PaymentMethodTranslation,
  BillingAddress,
  ShippingAddress,
} from "@shopware-pwa/types";
import {
  useShopwareContext,
  useCart,
  useInternationalization,
  useSessionContext,
} from ".";
import { _useContext } from "./internal/_useContext";
import { syncRefs } from "@vueuse/core";

export type UseUserReturn = {
  login: (params: { username: string; password: string }) => Promise<void>;
  register: (params: CustomerRegistrationParams) => Promise<Customer>;
  user: ComputedRef<Partial<Customer> | undefined>;
  isLoggedIn: ComputedRef<boolean>;
  isCustomerSession: ComputedRef<boolean>;
  isGuestSession: ComputedRef<boolean>;
  country: Ref<Country | null>;
  salutation: Ref<Salutation | null>;
  defaultBillingAddressId: ComputedRef<string | null>;
  defaultShippingAddressId: ComputedRef<string | null>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  loadCountry: (countryId: string) => Promise<void>;
  loadSalutation: (salutationId: string) => Promise<void>;
  updatePersonalInfo: (personals: CustomerUpdateProfileParam) => Promise<void>;
  updateEmail: (updateEmailData: CustomerUpdateEmailParam) => Promise<void>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;
  userDefaultPaymentMethod: ComputedRef<PaymentMethodTranslation | null>;
  userDefaultBillingAddress: ComputedRef<BillingAddress | null>;
  userDefaultShippingAddress: ComputedRef<ShippingAddress | null>;
};

/**
 * Composable for user management. Options - {@link UseUserReturn}
 */
export function useUser(): UseUserReturn {
  const { apiInstance } = useShopwareContext();
  const { userFromContext, refreshSessionContext } = useSessionContext();

  const _user = _useContext<Customer | undefined>("customer");
  syncRefs(userFromContext, _user, {
    immediate: true,
  });

  const { getStorefrontUrl } = useInternationalization();
  const { refreshCart } = useCart();

  const userDefaultPaymentMethod = computed(
    () => user.value?.defaultPaymentMethod?.translated || null
  );
  const userDefaultBillingAddress = computed(
    () => user.value?.defaultBillingAddress || null
  );
  const userDefaultShippingAddress = computed(
    () => user.value?.defaultShippingAddress || null
  );
  const country: Ref<Country | null> = ref(null);
  const salutation: Ref<Salutation | null> = ref(null);
  const user = computed(() => _user.value);

  async function login({
    username,
    password,
  }: { username?: string; password?: string } = {}): Promise<void> {
    await apiLogin({ username, password }, apiInstance);
    await refreshSessionContext();
    refreshCart();
  }

  async function register(
    params: CustomerRegistrationParams
  ): Promise<Customer> {
    const customer = await apiRegister(
      { ...params, storefrontUrl: getStorefrontUrl() } as any,
      apiInstance
    );
    _user.value = customer;
    await refreshSessionContext();
    return customer;
  }

  async function logout(): Promise<void> {
    await apiLogout(apiInstance);
    await refreshSessionContext();
    refreshCart();
  }

  async function refreshUser(params: ShopwareSearchParams = {}): Promise<void> {
    try {
      const user = await getCustomer(
        Object.assign(
          {},
          // getDefaults(),
          params
        ),
        apiInstance
      );
      _user.value = user as Customer;
    } catch (e) {
      _user.value = undefined;
      console.error("[useUser][refreshUser]", e);
    }
  }

  async function loadCountry(userId: string): Promise<void> {
    country.value = await getUserCountry(userId, apiInstance);
  }

  async function loadSalutation(salutationId: string): Promise<void> {
    salutation.value = await getUserSalutation(salutationId, apiInstance);
  }

  async function updatePersonalInfo(
    personals: CustomerUpdateProfileParam
  ): Promise<void> {
    await updateProfile(personals, apiInstance);
  }

  async function updateEmail(
    updateEmailData: CustomerUpdateEmailParam
  ): Promise<void> {
    await apiUpdateEmail(updateEmailData, apiInstance);
  }

  async function setDefaultPaymentMethod(
    paymentMethodId: string
  ): Promise<void> {
    await setDefaultCustomerPaymentMethod(paymentMethodId, apiInstance);
  }
  const defaultBillingAddressId = computed(
    () => user.value?.defaultBillingAddressId || null
  );
  const defaultShippingAddressId = computed(
    () => user.value?.defaultShippingAddressId || null
  );
  const isLoggedIn = computed(() => !!user.value?.id && !!user.value.active);
  const isCustomerSession = computed(
    () => !!user.value?.id && !user.value.guest
  );
  const isGuestSession = computed(() => !!user.value?.guest);

  return {
    login,
    register,
    user,
    isLoggedIn,
    isCustomerSession,
    isGuestSession,
    refreshUser,
    logout,
    updateEmail,
    updatePersonalInfo,
    setDefaultPaymentMethod,
    loadSalutation,
    salutation,
    loadCountry,
    country,
    defaultBillingAddressId,
    defaultShippingAddressId,
    userDefaultPaymentMethod,
    userDefaultBillingAddress,
    userDefaultShippingAddress,
  };
}
