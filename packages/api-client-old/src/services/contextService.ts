import type { Currency } from "@shopware-pwa/types";
import { defaultInstance, ShopwareApiInstance } from "../apiService";
import {
  getContextCurrencyEndpoint,
  getContextCountryEndpoint,
  getContextPaymentMethodEndpoint,
  getContextShippingMethodEndpoint,
  getContextLanguageEndpoint,
  getContextSalutationEndpoint,
  getContextEndpoint,
} from "../endpoints";
import type {
  Country,
  ShippingMethod,
  PaymentMethod,
  Language,
  Salutation,
  EntityResult,
  UpdateContextParams,
  ContextTokenResponse,
  SessionContext,
  ShopwareSearchParams,
} from "@shopware-pwa/types";
import { extractContextToken } from "../helpers/context";

/**
 * Updates the current session's context
 *
 * @param params {UpdateContextParams} params to update the context
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
async function updateContext(
  params: UpdateContextParams,
  contextInstance: ShopwareApiInstance,
): Promise<{
  contextToken: string;
  redirectUrl?: string;
  apiAlias: "array_struct";
}> {
  const resp = await contextInstance.invoke.patch(getContextEndpoint(), params);
  const contextToken = extractContextToken(resp);
  return {
    contextToken,
    redirectUrl: resp.data.redirectUrl,
    apiAlias: "array_struct",
  };
}

/**
 * Loads session context, containing all session-related data.
 *
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiErrosr
 * @category Context
 * @public
 */
export async function getSessionContext(
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<SessionContext> {
  const { data } = await contextInstance.invoke.get(getContextEndpoint());
  return data;
}

/**
 * Set the current session's shipping address to correspoding to id
 *
 * @param {string} shippingAddressId id of the shipping address
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function setCurrentShippingAddress(
  shippingAddressId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<ContextTokenResponse> {
  return (await updateContext(
    { shippingAddressId },
    contextInstance,
  )) as unknown as ContextTokenResponse;
}

/**
 * Set the current session's billing address to correspoding to id
 *
 * @param {string} billingAddressId id of the billing address
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function setCurrentBillingAddress(
  billingAddressId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<ContextTokenResponse> {
  return (await updateContext(
    { billingAddressId },
    contextInstance,
  )) as unknown as ContextTokenResponse;
}

/**
 * Get all available currencies
 *
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getAvailableCurrencies(
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<Currency[]> {
  const { data } = await contextInstance.invoke.get(
    getContextCurrencyEndpoint(),
  );

  return data;
}

/**
 * Set the current session's currency to correspoding to id
 *
 * @param {string} newCurrencyID id of the currency
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function setCurrentCurrency(
  newCurrencyID: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<ContextTokenResponse> {
  const params = { currencyId: newCurrencyID };
  const resp = (await updateContext(
    params,
    contextInstance,
  )) as unknown as ContextTokenResponse;

  return resp;
}

/**
 * Get all available languages
 *
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getAvailableLanguages(
  contextInstance: ShopwareApiInstance = defaultInstance,
) {
  const { data } = await contextInstance.invoke.get<
    EntityResult<"language", Language>
  >(getContextLanguageEndpoint());

  return data;
}

/**
 * Set the current session's language to corresponding to id
 *
 * @param {string} newLanguageId id of the language
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function setCurrentLanguage(
  newLanguageId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<ContextTokenResponse> {
  const params = { languageId: newLanguageId };
  const resp = (await updateContext(
    params,
    contextInstance,
  )) as unknown as ContextTokenResponse;

  return resp;
}

/**
 * Set the current session's country
 *
 * @param {string} newCountryId id of the country
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */

export async function setCurrentCountry(
  newCountryId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<ContextTokenResponse> {
  const params = { countryId: newCountryId };
  const resp = (await updateContext(
    params,
    contextInstance,
  )) as unknown as ContextTokenResponse;

  return resp;
}

/**
 * Get all available countries
 *
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getAvailableCountries(
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<EntityResult<"country", Country>> {
  const { data } = await contextInstance.invoke.post<
    EntityResult<"country", Country>
  >(getContextCountryEndpoint(), {
    associations: {
      states: {},
    },
  });
  return data;
}

/**
 * Get all available salutations
 *
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getAvailableSalutations(
  contextInstance: ShopwareApiInstance = defaultInstance,
) {
  const resp = await contextInstance.invoke.get<
    EntityResult<"salutation", Salutation>
  >(getContextSalutationEndpoint());
  return resp.data;
}

/**
 * get all available payment methods
 *
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 * @param {object} params additional params
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getAvailablePaymentMethods(
  contextInstance: ShopwareApiInstance = defaultInstance,
  params: { onlyAvailable?: boolean } = {},
) {
  const resp = await contextInstance.invoke.get<
    EntityResult<"payment_method", PaymentMethod>
  >(getContextPaymentMethodEndpoint(), {
    params,
  });

  return resp.data;
}

/**
 * Get payment method details
 *
 * @param {string} paymentId id of the payment method
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getPaymentMethodDetails(
  paymentId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<PaymentMethod> {
  const { data } = await contextInstance.invoke.get(
    getContextPaymentMethodEndpoint(),
    {
      params: {
        "filter[id]": paymentId,
      },
    },
  );

  return data?.elements?.[0];
}

/**
 * Set the current session's payment method to correspoding to id
 *
 * @param {string} newPaymentMethodId id of the payment method
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function setCurrentPaymentMethod(
  newPaymentMethodId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<ContextTokenResponse> {
  const params = { paymentMethodId: newPaymentMethodId };
  const resp = (await updateContext(
    params,
    contextInstance,
  )) as unknown as ContextTokenResponse;

  return resp;
}

/**
 * Get all available shipping methods
 *
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 * @param {object} params additional params
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getAvailableShippingMethods(
  contextInstance: ShopwareApiInstance = defaultInstance,
  params: ShopwareSearchParams = {},
) {
  const resp = await contextInstance.invoke.post<
    EntityResult<"shipping_method", ShippingMethod>
  >(getContextShippingMethodEndpoint(), params);

  return resp.data;
}

/**
 * Get Shipping method details
 *
 * @param {string} shippingId id of the shipping method
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getShippingMethodDetails(
  shippingId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<ShippingMethod> {
  const { data } = await contextInstance.invoke.get(
    getContextShippingMethodEndpoint(),
    {
      params: {
        "filter[id]": shippingId,
      },
    },
  );

  return data?.elements?.[0];
}

/**
 * Set the current session's shipping method to correspoding to id
 *
 * @param {string} newShippingMethodId id of the shipping method
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function setCurrentShippingMethod(
  newShippingMethodId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<ContextTokenResponse> {
  const params = { shippingMethodId: newShippingMethodId };
  const resp = (await updateContext(
    params,
    contextInstance,
  )) as unknown as ContextTokenResponse;

  return resp;
}
/**
 * Get the current session's country
 *
 * @param {string} countryId id of the country
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getUserCountry(
  countryId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<Country> {
  const { data } = await contextInstance.invoke.get(
    getContextCountryEndpoint(),
    {
      params: {
        "filter[id]": countryId,
      },
    },
  );

  return data?.elements?.[0];
}

/**
 * Get the current session's salutation
 *
 * @param {string} salutationId id of the salutation
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getUserSalutation(
  salutationId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<Salutation> {
  const { data } = await contextInstance.invoke.get(
    getContextSalutationEndpoint(),
    {
      params: {
        "filter[id]": salutationId,
      },
    },
  );

  return data?.elements?.[0];
}
