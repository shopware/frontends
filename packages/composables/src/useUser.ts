import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";
import {
  useShopwareContext,
  useCart,
  useInternationalization,
  useSessionContext,
  useContext,
} from "#imports";
import { syncRefs } from "@vueuse/core";
import type { RequestParameters, Schemas } from "#shopware";

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
  register(params: RequestParameters<"register">): Promise<Schemas["Customer"]>;
  /**
   * Whole {@link Customer} object
   */
  user: ComputedRef<Schemas["Customer"] | undefined>;
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
  country: Ref<Schemas["Country"] | null>;
  /**
   * {@link Salutation} of the user
   */
  salutation: Ref<Schemas["Salutation"] | null>;
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
   * @param personals {@link RequestParameters<'changeProfile'>}
   * @returns
   */
  updatePersonalInfo(
    personals: RequestParameters<"changeProfile">,
  ): Promise<void>;
  /**
   * Updates the user email
   * @param updateEmailData - {@link RequestParameters<'changeEmail'>}
   * @returns
   */
  updateEmail(updateEmailData: RequestParameters<"changeEmail">): Promise<void>;
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
  userDefaultBillingAddress: ComputedRef<Schemas["CustomerAddress"] | null>;
  /**
   * Default shipping address for the user
   */
  userDefaultShippingAddress: ComputedRef<Schemas["CustomerAddress"] | null>;
};

/**
 * Composable for user management.
 * @public
 * @category Customer & Account
 */
export function useUser(): UseUserReturn {
  const { apiClient } = useShopwareContext();
  const { userFromContext, refreshSessionContext } = useSessionContext();

  const _user = useContext<Schemas["Customer"] | undefined>("customer");
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
  const country: Ref<Schemas["Country"] | null> = ref(null);
  const salutation: Ref<Schemas["Salutation"] | null> = ref(null);
  const user = computed(() => _user.value);

  async function login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<void> {
    await apiClient.invoke("loginCustomer post /account/login", {
      username,
      password,
    });
    await refreshSessionContext();
    refreshCart();
  }

  async function register(
    params: RequestParameters<"register">,
  ): Promise<Schemas["Customer"]> {
    const customer = await apiClient.invoke("register post /account/register", {
      ...params,
      storefrontUrl: getStorefrontUrl(),
    });
    _user.value = customer;
    if (_user.value?.active) await refreshSessionContext();
    return customer;
  }

  async function logout(): Promise<void> {
    await apiClient.invoke("logoutCustomer post /account/logout");
    await refreshSessionContext();
    refreshCart();
  }

  async function refreshUser(params: Schemas["Criteria"] = {}): Promise<void> {
    try {
      const user = await apiClient.invoke(
        "readCustomer post /account/customer",
        params,
      );
      _user.value = user;
    } catch (e) {
      _user.value = undefined;
      console.error("[useUser][refreshUser]", e);
    }
  }

  async function loadCountry(countryId: string): Promise<void> {
    const countries = await apiClient.invoke("readCountry post /country", {
      filter: [
        {
          field: "id",
          type: "equals",
          value: countryId,
        },
      ],
    });

    country.value = countries.elements?.[0] ?? null;
  }

  async function loadSalutation(salutationId: string): Promise<void> {
    const salutations = await apiClient.invoke(
      "readSalutation post /salutation",
      {
        filter: [
          {
            field: "id",
            type: "equals",
            value: salutationId,
          },
        ],
      },
    );
    salutation.value = salutations.elements?.[0] ?? null;
  }

  async function updatePersonalInfo(
    personals: RequestParameters<"changeProfile">,
  ): Promise<void> {
    await apiClient.invoke(
      "changeProfile post /account/change-profile",
      personals,
    );
  }

  async function updateEmail(
    updateEmailData: RequestParameters<"changeEmail">,
  ): Promise<void> {
    await apiClient.invoke(
      "changeEmail post /account/change-email",
      updateEmailData,
    );
  }

  async function setDefaultPaymentMethod(
    paymentMethodId: string,
  ): Promise<void> {
    await apiClient.invoke(
      "changePaymentMethod post /account/change-payment-method/{paymentMethodId}",
      {
        paymentMethodId,
      },
    );
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
