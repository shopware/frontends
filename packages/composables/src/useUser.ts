import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  updateEmail as apiUpdateEmail,
  getCustomer,
  getUserCountry,
  getUserSalutation,
  updateProfile,
  setDefaultCustomerPaymentMethod,
} from "@shopware-pwa/api-client";
import type {
  CustomerUpdateProfileParam,
  CustomerUpdateEmailParam,
} from "@shopware-pwa/api-client";
import type {
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
  useContext,
} from "#imports";
import { syncRefs } from "@vueuse/core";
import type { Schemas } from "#shopware";

export type UseUserReturn = {
  /**
   * Logs-in user with given credentials
   * @param params - username and password
   *
   * @see https://github.com/shopware/frontends/issues/112 if login fails due to missing context token
   */
  login(params: { username: string; password: string }): Promise<void>;
  /**
   * Registers the user for given credentials
   * @param params {@link CustomerRegistrationParams}
   * @returns {@link Customer} object on success
   */
  register(params: CustomerRegistrationParams): Promise<Customer>;
  /**
   * Whole {@link Customer} object
   */
  user: ComputedRef<Partial<Customer> | undefined>;
  /**
   * Indicates if the user is logged in
   */
  isLoggedIn: ComputedRef<boolean>;
  /**
   * Indicates if the user is logged in as a customer (not a guest)
   */
  isCustomerSession: ComputedRef<boolean>;
  /**
   * Indicates if the user is logged in as a guest
   */
  isGuestSession: ComputedRef<boolean>;
  /**
   * {@link Country} of the user
   */
  country: Ref<Country | null>;
  /**
   * {@link Salutation} of the user
   */
  salutation: Ref<Salutation | null>;
  /**
   * Default billing address id
   */
  defaultBillingAddressId: ComputedRef<string | null>;
  /**
   * Default shipping address id
   */
  defaultShippingAddressId: ComputedRef<string | null>;
  /**
   * Fetches the user data from the API
   */
  refreshUser(): Promise<void>;
  /**
   * Logs out the user
   */
  logout(): Promise<void>;
  /**
   * Loads the {@link Country} of the user
   */
  loadCountry(countryId: string): Promise<void>;
  /**
   * Loads the {@link Salutation} for given id
   */
  loadSalutation(salutationId: string): Promise<void>;
  /**
   * Updates the user profile data
   * @param personals {@link CustomerUpdateProfileParam}
   * @returns
   */
  updatePersonalInfo(personals: CustomerUpdateProfileParam): Promise<void>;
  /**
   * Updates the user email
   * @param updateEmailData - {@link CustomerUpdateEmailParam}
   * @returns
   */
  updateEmail(updateEmailData: CustomerUpdateEmailParam): Promise<void>;
  /**
   * Sets the default payment method for given id
   * @param paymentMethodId
   * @returns
   */
  setDefaultPaymentMethod(paymentMethodId: string): Promise<void>;
  /**
   * Default payment method for the user
   */
  userDefaultPaymentMethod: ComputedRef<
    Schemas["PaymentMethod"]["translated"] | null
  >;
  /**
   * Default billing address for the user
   */
  userDefaultBillingAddress: ComputedRef<BillingAddress | null>;
  /**
   * Default shipping address for the user
   */
  userDefaultShippingAddress: ComputedRef<ShippingAddress | null>;
};

/**
 * Composable for user management.
 * @public
 * @category Customer & Account
 */
export function useUser(): UseUserReturn {
  const { apiInstance } = useShopwareContext();
  const { userFromContext, refreshSessionContext } = useSessionContext();

  const _user = useContext<Customer | undefined>("customer");
  syncRefs(userFromContext, _user, {
    immediate: true,
  });

  const { getStorefrontUrl } = useInternationalization();
  const { refreshCart } = useCart();

  const userDefaultPaymentMethod = computed(
    () => user.value?.defaultPaymentMethod?.translated || null,
  );
  const userDefaultBillingAddress = computed(
    () => user.value?.defaultBillingAddress || null,
  );
  const userDefaultShippingAddress = computed(
    () => user.value?.defaultShippingAddress || null,
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
    params: CustomerRegistrationParams,
  ): Promise<Customer> {
    const customer = await apiRegister(
      { ...params, storefrontUrl: getStorefrontUrl() } as any,
      apiInstance,
    );
    _user.value = customer;
    if (_user.value?.active) await refreshSessionContext();
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
          params,
        ),
        apiInstance,
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
    personals: CustomerUpdateProfileParam,
  ): Promise<void> {
    await updateProfile(personals, apiInstance);
  }

  async function updateEmail(
    updateEmailData: CustomerUpdateEmailParam,
  ): Promise<void> {
    await apiUpdateEmail(updateEmailData, apiInstance);
  }

  async function setDefaultPaymentMethod(
    paymentMethodId: string,
  ): Promise<void> {
    await setDefaultCustomerPaymentMethod(paymentMethodId, apiInstance);
  }
  const defaultBillingAddressId = computed(
    () => user.value?.defaultBillingAddressId || null,
  );
  const defaultShippingAddressId = computed(
    () => user.value?.defaultShippingAddressId || null,
  );
  const isLoggedIn = computed(
    () => !!user.value?.id && !!user.value.active && !user.value.guest,
  );

  const isCustomerSession = computed(
    () => !!user.value?.id && !user.value.guest,
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
