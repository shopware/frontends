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
  setLanguage: (language: Partial<Language>) => Promise<void>;
  sessionContext: ComputedRef<SessionContext | undefined>;
  refreshSessionContext: () => Promise<void>;
  shippingMethod: ComputedRef<ShippingMethod | null>;
  setShippingMethod: (shippingMethod: Partial<ShippingMethod>) => Promise<void>;
  paymentMethod: ComputedRef<PaymentMethod | null>;
  setPaymentMethod: (paymentMethod: Partial<PaymentMethod>) => Promise<void>;
  currency: ComputedRef<Currency | null>;
  setCurrency: (currency: Partial<Currency>) => Promise<void>;
  activeShippingAddress: ComputedRef<ShippingAddress | null>;
  setActiveShippingAddress: (
    address: Partial<ShippingAddress>
  ) => Promise<void>;
  activeBillingAddress: ComputedRef<BillingAddress | null>;
  taxState: ComputedRef<string | null>;
  setActiveBillingAddress: (address: Partial<BillingAddress>) => Promise<void>;
  countryId: ComputedRef<string | undefined>;
  // events for interceptors
  onCurrencyChange: (fn: (params: { currency: Currency }) => void) => void;
  onPaymentMethodChange: (
    fn: (params: { paymentMethod: PaymentMethod }) => void
  ) => void;
  onShippingMethodChange: (
    fn: (params: { shippingMethod: ShippingMethod }) => void
  ) => void;
  userFromContext: ComputedRef<Customer | undefined>;
};

interface IInterceptorCallbackFunction {
  (payload: any): void;
}

/**
 * Composable for session management. Options - {@link UseSessionContextReturn}
 * SessionContext contain all related data like user, currency, country, shippingMethod, paymentMethod etc.
 */
export function useSessionContext(
  newContext?: SessionContext
): UseSessionContextReturn {
  const { apiInstance } = useShopwareContext();
  const { init } = usePrice();
  // const { broadcast, intercept } = useIntercept();

  const _sessinContext = _useContext("swSessionContext", {
    replace: newContext,
  });

  const onCurrencyChange = (fn: IInterceptorCallbackFunction) => {}; // intercept(INTERCEPTOR_KEYS.SESSION_SET_CURRENCY, fn);
  const onPaymentMethodChange = (fn: IInterceptorCallbackFunction) => {}; // intercept(INTERCEPTOR_KEYS.SESSION_SET_PAYMENT_METHOD, fn);
  const onShippingMethodChange = (fn: IInterceptorCallbackFunction) => {}; // intercept(INTERCEPTOR_KEYS.SESSION_SET_SHIPPING_METHOD, fn);

  const sessionContext = computed(() => _sessinContext.value);
  const refreshSessionContext = async () => {
    try {
      const context = await getSessionContext(apiInstance);
      _sessinContext.value = context;
      init({
        currencyPosition: context.currency.position,
        currencySymbol: context.currency.symbol,
      });
    } catch (e) {
      console.error("[UseSessionContext][refreshSessionContext]", e);
    }
  };

  const shippingMethod = computed(
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
    // broadcast(INTERCEPTOR_KEYS.SESSION_SET_SHIPPING_METHOD, {
    //   shippingMethod,
    // });
  };

  const paymentMethod = computed(
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
    // broadcast(INTERCEPTOR_KEYS.SESSION_SET_PAYMENT_METHOD, {
    //   paymentMethod,
    // });
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
    // broadcast(INTERCEPTOR_KEYS.SESSION_SET_CURRENCY, {
    //   currency,
    // });
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
    shippingMethod,
    setShippingMethod,
    paymentMethod,
    setPaymentMethod,
    currency,
    setCurrency,
    activeShippingAddress,
    setActiveShippingAddress,
    activeBillingAddress,
    setActiveBillingAddress,
    countryId,
    taxState,
    // interceptors
    onCurrencyChange,
    onPaymentMethodChange,
    onShippingMethodChange,
    userFromContext,
    setLanguage,
  };
}
