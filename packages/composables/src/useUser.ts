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
import type { Schemas, operations } from "#shopware";

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
  register(
    params: Omit<
      operations["register post /account/register"]["body"],
      "storefrontUrl"
    >,
  ): Promise<Schemas["Customer"]>;
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
  refreshUser(params?: Schemas["Criteria"]): Promise<Schemas["Customer"]>;
  /**
   * Logs out the user
   */
  logout(): Promise<
    operations["logoutCustomer post /account/logout"]["response"]
  >;
  /**
   * Loads the {@link Country} of the user
   */
  loadCountry(
    countryId: string,
  ): Promise<operations["readCountry post /country"]["response"]>;
  /**
   * Loads the {@link Salutation} for given id
   */
  loadSalutation(
    salutationId: string,
  ): Promise<operations["readSalutation post /salutation"]["response"]>;
  /**
   * Updates the user profile data
   * @param personals {@link RequestParameters<'changeProfile'>}
   * @returns
   */
  updatePersonalInfo(
    personals: operations["changeProfile post /account/change-profile"]["body"],
  ): Promise<void>;
  /**
   * Updates the user email
   * @param updateEmailData - {@link RequestParameters<'changeEmail'>}
   * @returns
   */
  updateEmail(
    updateEmailData: operations["changeEmail post /account/change-email"]["body"],
  ): Promise<void>;
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
      body: {
        username,
        password,
      },
    });
    await refreshSessionContext();
    refreshCart();
  }

  async function register(
    params: Omit<
      operations["register post /account/register"]["body"],
      "storefrontUrl"
    >,
  ): Promise<Schemas["Customer"]> {
    const { data } = await apiClient.invoke("register post /account/register", {
      body: {
        ...params,
        storefrontUrl: getStorefrontUrl(),
      },
    });
    _user.value = data;
    if (_user.value?.active) await refreshSessionContext();
    return data;
  }

  async function logout(): Promise<
    operations["logoutCustomer post /account/logout"]["response"]
  > {
    const response = await apiClient.invoke(
      "logoutCustomer post /account/logout",
    );
    await refreshSessionContext();
    refreshCart();
    return response.data;
  }

  async function refreshUser(
    params: Schemas["Criteria"] = {},
  ): Promise<Schemas["Customer"]> {
    try {
      const response = await apiClient.invoke(
        "readCustomer post /account/customer",
        { body: params },
      );
      _user.value = response.data;
      return response.data;
    } catch (e) {
      _user.value = undefined;
      throw e;
    }
  }

  async function loadCountry(
    countryId: string,
  ): Promise<operations["readCountry post /country"]["response"]> {
    const countries = await apiClient.invoke("readCountry post /country", {
      body: {
        filter: [
          {
            field: "id",
            type: "equals",
            value: countryId,
          },
        ],
      },
    });

    country.value = countries.data.elements?.[0] ?? null;
    return countries.data;
  }

  async function loadSalutation(
    salutationId: string,
  ): Promise<operations["readSalutation post /salutation"]["response"]> {
    const salutations = await apiClient.invoke(
      "readSalutation post /salutation",
      {
        body: {
          filter: [
            {
              field: "id",
              type: "equals",
              value: salutationId,
            },
          ],
        },
      },
    );
    salutation.value = salutations.data.elements?.[0] ?? null;
    return salutations.data;
  }

  async function updatePersonalInfo(
    personals: operations["changeProfile post /account/change-profile"]["body"],
  ): Promise<void> {
    await apiClient.invoke("changeProfile post /account/change-profile", {
      body: personals,
    });
  }

  async function updateEmail(
    updateEmailData: operations["changeEmail post /account/change-email"]["body"],
  ): Promise<void> {
    await apiClient.invoke("changeEmail post /account/change-email", {
      body: updateEmailData,
    });
  }

  async function setDefaultPaymentMethod(
    paymentMethodId: string,
  ): Promise<void> {
    await apiClient.invoke(
      "changePaymentMethod post /account/change-payment-method/{paymentMethodId}",
      {
        pathParams: { paymentMethodId },
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
