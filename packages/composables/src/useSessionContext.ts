import { computed } from "vue";
import type { ComputedRef } from "vue";

import { useContext, useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";

export type UseSessionContextReturn = {
  /**
   * Patches the context in order to use new language
   */
  setLanguage(language: Partial<Schemas["Language"]>): Promise<void>;
  /**
   * Patches the context in order to use new countryId
   *
   * @param {string} countryId
   */
  setCountry(countryId: string): Promise<void>;
  /**
   * current context's language
   */
  sessionContext: ComputedRef<Schemas["SalesChannelContext"] | undefined>;
  /**
   * Fetches the session context and assigns the result to the `sessionContext` property
   */
  refreshSessionContext(): Promise<void>;
  /**
   * current context's language
   */
  selectedShippingMethod: ComputedRef<Schemas["ShippingMethod"] | null>;
  /**
   * Patches the context in order to use new shipping method
   */
  setShippingMethod(
    shippingMethod: Partial<Schemas["ShippingMethod"]>,
  ): Promise<void>;
  /**
   * current context's payment method
   */
  selectedPaymentMethod: ComputedRef<Schemas["PaymentMethod"] | null>;
  /**
   * Patches the context in order to use new payment method
   */
  setPaymentMethod(paymentMethod: { id: string }): Promise<void>;
  /**
   * current context's currency
   */
  currency: ComputedRef<Schemas["Currency"] | null>;
  /**
   * Patches the context in order to use new currency
   */
  setCurrency(currency: Partial<Schemas["Currency"]>): Promise<void>;
  /**
   * current context's shipping address
   */
  activeShippingAddress: ComputedRef<Schemas["CustomerAddress"] | null>;
  /**
   * Patches the context in order to use new shipping address
   */
  setActiveShippingAddress(
    address: Partial<Schemas["CustomerAddress"]>,
  ): Promise<void>;
  /**
   * current context's billing address
   */
  activeBillingAddress: ComputedRef<Schemas["CustomerAddress"] | null>;
  /**
   * current context's tax state
   */
  taxState: ComputedRef<string | undefined>;
  /**
   * Patches the context in order to use new billing address
   */
  setActiveBillingAddress(
    address: Partial<Schemas["CustomerAddress"]>,
  ): Promise<void>;
  /**
   * Patches the context with new context
   */
  setContext(context: Schemas["SalesChannelContext"]): void;
  /**
   * current context's country id
   */
  countryId: ComputedRef<string | undefined>;
  /**
   * current sales channel country id
   */
  salesChannelCountryId: ComputedRef<string | undefined>;
  /**
   * current language id
   */
  languageId: ComputedRef<string | undefined>;
  /**
   * current language id chain
   */
  languageIdChain: ComputedRef<string>;
  /**
   * current context's customer object
   */
  userFromContext: ComputedRef<Schemas["Customer"] | undefined>;
};

/**
 * Composable for session management.
 * SessionContext contain all related data like user, currency, country, shippingMethod, paymentMethod etc.
 * @public
 * @category Context & Language
 */
export function useSessionContext(
  newContext?: Schemas["SalesChannelContext"],
): UseSessionContextReturn {
  const { apiClient } = useShopwareContext();

  const _sessionContext = useContext("swSessionContext", {
    replace: newContext,
  });

  const sessionContext = computed(() => _sessionContext.value);
  const refreshSessionContext = async () => {
    try {
      const { data } = await apiClient.invoke("readContext get /context");
      _sessionContext.value = data;
    } catch (e) {
      console.error("[UseSessionContext][refreshSessionContext]", e);
    }
  };

  const selectedShippingMethod = computed(
    () => sessionContext.value?.shippingMethod || null,
  );
  const setShippingMethod = async (shippingMethod: { id: string }) => {
    if (!shippingMethod?.id) {
      throw new Error(
        "You need to provide shipping method id in order to set shipping method.",
      );
    }
    await apiClient.invoke("updateContext patch /context", {
      body: { shippingMethodId: shippingMethod.id },
    });
    await refreshSessionContext();
  };

  const selectedPaymentMethod = computed(
    () => sessionContext.value?.paymentMethod || null,
  );
  const setPaymentMethod = async (paymentMethod: { id: string }) => {
    if (!paymentMethod?.id) {
      throw new Error(
        "You need to provide payment method id in order to set payment method.",
      );
    }
    await apiClient.invoke("updateContext patch /context", {
      body: { paymentMethodId: paymentMethod.id },
    });
    await refreshSessionContext();
  };

  const currency = computed(() => sessionContext.value?.currency || null);
  const setCurrency = async (currency: Partial<Schemas["Currency"]>) => {
    if (!currency.id) {
      console.error(
        "You need to provide currency id in order to set currency.",
        currency,
      );
      return;
    }
    await apiClient.invoke("updateContext patch /context", {
      body: {
        currencyId: currency.id,
      },
    });
    await refreshSessionContext();
  };

  const setLanguage = async (language: Partial<Schemas["Language"]>) => {
    if (!language.id) {
      return;
    }
    await apiClient.invoke("updateContext patch /context", {
      body: {
        languageId: language.id,
      },
    });
    await refreshSessionContext();
  };

  const setCountry = async (countryId: string) => {
    await apiClient.invoke("updateContext patch /context", {
      body: {
        countryId,
      },
    });
    await refreshSessionContext();
  };

  const activeShippingAddress = computed(
    () =>
      sessionContext.value?.customer?.activeShippingAddress ||
      sessionContext.value?.shippingLocation?.address ||
      null,
  );
  const setActiveShippingAddress = async (
    address: Partial<Schemas["CustomerAddress"]>,
  ) => {
    if (!address?.id) {
      throw new Error(
        "You need to provide address id in order to set the address.",
      );
    }
    await apiClient.invoke("updateContext patch /context", {
      body: {
        shippingAddressId: address.id,
      },
    });
    refreshSessionContext();
  };

  // TODO: replace the source from defaultBillingAddress by new value once NEXT-28627 is solved
  const activeBillingAddress = computed(
    () => sessionContext.value?.customer?.activeBillingAddress || null,
  );
  const setActiveBillingAddress = async (
    address: Partial<Schemas["CustomerAddress"]>,
  ) => {
    if (!address?.id) {
      throw new Error(
        "You need to provide address id in order to set the address.",
      );
    }
    await apiClient.invoke("updateContext patch /context", {
      body: {
        billingAddressId: address.id,
      },
    });
    refreshSessionContext();
  };

  const setContext = (context: Schemas["SalesChannelContext"]) => {
    _sessionContext.value = context;
  };

  const countryId = computed(
    () => sessionContext.value?.shippingLocation?.country?.id,
  );

  const salesChannelCountryId = computed(
    () => sessionContext.value?.salesChannel?.countryId,
  );

  const languageId = computed(
    () => sessionContext.value?.salesChannel?.languageId,
  );
  const languageIdChain = computed(
    () => sessionContext.value?.context?.languageIdChain?.[0] || "",
  );
  const taxState = computed(() => sessionContext.value?.context?.taxState);
  const userFromContext = computed(() => sessionContext.value?.customer);

  return {
    sessionContext,
    refreshSessionContext,
    selectedShippingMethod,
    setShippingMethod,
    selectedPaymentMethod,
    setPaymentMethod,
    currency,
    setCurrency,
    activeShippingAddress,
    setActiveShippingAddress,
    activeBillingAddress,
    setActiveBillingAddress,
    countryId,
    salesChannelCountryId,
    taxState,
    userFromContext,
    setLanguage,
    languageId,
    languageIdChain,
    setCountry,
    setContext,
  };
}
