import { computed, ComputedRef, inject, provide, Ref, ref } from "vue";
import {
  ShippingMethod,
  PaymentMethod,
  Currency,
  ShippingAddress,
  BillingAddress,
  SessionContext,
  Customer,
  Language,
} from "@shopware-pwa/types";

import {
  getSessionContext,
  setCurrentShippingMethod,
  setCurrentCurrency,
  setCurrentPaymentMethod,
  setCurrentShippingAddress,
  setCurrentBillingAddress,
  setCurrentLanguage,
} from "@shopware-pwa/api-client";
import { useShopwareContext } from "./useShopwareContext";
import { usePrice } from "./usePrice";
import { _useContext } from "./internal/_useContext";

export type UseSessionContextReturn = {
  /**
   * Patches the context in order to use new language
   */
  setLanguage(language: Partial<Language>): Promise<void>;
  /**
   * current context's language
   */
  sessionContext: ComputedRef<SessionContext | undefined>;
  /**
   * Fetches the session context and assigns the result to the `sessionContext` property
   */
  refreshSessionContext(): Promise<void>;
  /**
   * current context's language
   */
  selectedShippingMethod: ComputedRef<ShippingMethod | null>;
  /**
   * Patches the context in order to use new shipping method
   */
  setShippingMethod(shippingMethod: Partial<ShippingMethod>): Promise<void>;
  /**
   * current context's payment method
   */
  selectedPaymentMethod: ComputedRef<PaymentMethod | null>;
  /**
   * Patches the context in order to use new payment method
   */
  setPaymentMethod(paymentMethod: Partial<PaymentMethod>): Promise<void>;
  /**
   * current context's currency
   */
  currency: ComputedRef<Currency | null>;
  /**
   * Patches the context in order to use new currency
   */
  setCurrency(currency: Partial<Currency>): Promise<void>;
  /**
   * current context's shipping address
   */
  activeShippingAddress: ComputedRef<ShippingAddress | null>;
  /**
   * Patches the context in order to use new shipping address
   */
  setActiveShippingAddress(address: Partial<ShippingAddress>): Promise<void>;
  /**
   * current context's billing address
   */
  activeBillingAddress: ComputedRef<BillingAddress | null>;
  /**
   * current context's tax state
   */
  taxState: ComputedRef<string | null>;
  /**
   * Patches the context in order to use new billing address
   */
  setActiveBillingAddress(address: Partial<BillingAddress>): Promise<void>;
  /**
   * current context's country id
   */
  countryId: ComputedRef<string | undefined>;
  /**
   * current context's customer object
   */
  userFromContext: ComputedRef<Customer | undefined>;
};

/**
 * Composable for session management.
 * SessionContext contain all related data like user, currency, country, shippingMethod, paymentMethod etc.
 * @public
 * @category Context & Language
 */
export function useSessionContext(
  newContext?: SessionContext
): UseSessionContextReturn {
  const { apiInstance } = useShopwareContext();
  const { init } = usePrice();

  if (newContext) {
    init({
      currencyCode: newContext.currency?.isoCode,
      localeCode: newContext.salesChannel?.language?.locale?.code,
    });
  }

  const _sessionContext = _useContext("swSessionContext", {
    replace: newContext,
  });

  const sessionContext = computed(() => _sessionContext.value);
  const refreshSessionContext = async () => {
    try {
      const context = await getSessionContext(apiInstance);
      _sessionContext.value = context;

      init({
        currencyCode: context.currency?.isoCode,
        localeCode: context.salesChannel?.language?.locale?.code,
      });
    } catch (e) {
      console.error("[UseSessionContext][refreshSessionContext]", e);
    }
  };

  const selectedShippingMethod = computed(
    () => sessionContext.value?.shippingMethod || null
  );
  const setShippingMethod = async (
    shippingMethod: Partial<ShippingMethod> = {}
  ) => {
    if (!shippingMethod?.id) {
      throw new Error(
        "You need to provide shipping method id in order to set shipping method."
      );
    }
    await setCurrentShippingMethod(shippingMethod.id, apiInstance);
    await refreshSessionContext();
  };

  const selectedPaymentMethod = computed(
    () => sessionContext.value?.paymentMethod || null
  );
  const setPaymentMethod = async (
    paymentMethod: Partial<PaymentMethod> = {}
  ) => {
    if (!paymentMethod?.id) {
      throw new Error(
        "You need to provide payment method id in order to set payment method."
      );
    }
    await setCurrentPaymentMethod(paymentMethod.id, apiInstance);
    await refreshSessionContext();
  };

  const currency = computed(() => sessionContext.value?.currency || null);
  const setCurrency = async (currency: Partial<Currency> = {}) => {
    if (!currency.id) {
      console.error(
        "You need to provide currency id in order to set currency.",
        currency
      );
      return;
    }
    await setCurrentCurrency(currency.id, apiInstance);
    await refreshSessionContext();
  };

  const setLanguage = async (language: Partial<Language> = {}) => {
    if (!language.id) {
      return;
    }
    await setCurrentLanguage(language.id, apiInstance);
    await refreshSessionContext();
  };

  const activeShippingAddress = computed(
    () => sessionContext.value?.customer?.activeShippingAddress || null
  );
  const setActiveShippingAddress = async (
    address: Partial<ShippingAddress>
  ) => {
    if (!address?.id) {
      throw new Error(
        "You need to provide address id in order to set the address."
      );
    }
    await setCurrentShippingAddress(address.id, apiInstance);
    refreshSessionContext();
  };

  const activeBillingAddress = computed(
    () => sessionContext.value?.customer?.activeBillingAddress || null
  );
  const setActiveBillingAddress = async (address: Partial<BillingAddress>) => {
    if (!address?.id) {
      throw new Error(
        "You need to provide address id in order to set the address."
      );
    }
    await setCurrentBillingAddress(address.id, apiInstance);
    refreshSessionContext();
  };

  const countryId = computed(
    () => sessionContext.value?.salesChannel?.countryId
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
    taxState,
    userFromContext,
    setLanguage,
  };
}
