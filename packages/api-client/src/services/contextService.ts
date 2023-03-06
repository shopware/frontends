import { Currency } from "@shopware-pwa/types";
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
import {
  Country,
  ShippingMethod,
  PaymentMethod,
  Language,
  Salutation,
  EntityResult,
  UpdateContextParams,
  ContextTokenResponse,
  SessionContext,
} from "@shopware-pwa/types";
import { extractContextToken } from "../helpers/context";

/**
 * @throws ClientApiError
 * @category Context
 * @public
 */
async function updateContext(
  params: UpdateContextParams,
  contextInstance: ShopwareApiInstance
): Promise<ContextTokenResponse> {
  const resp = await contextInstance.invoke.patch(getContextEndpoint(), params);
  const contextToken = extractContextToken(resp);
  return { contextToken };
}

/**
 * Loads session context, containing all session-related data.
 *
 * @throws ClientApiErrosr
 * @category Context
 * @public
 */
export async function getSessionContext(
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<SessionContext> {
  const { data } = await contextInstance.invoke.get(getContextEndpoint());
  return data;
}

/**
 * Set the current session's shipping address to correspoding to id
 * @throws ClientApiError
 * @category Context
 * @public
 */
export function setCurrentShippingAddress(
  shippingAddressId: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<ContextTokenResponse> {
  return updateContext({ shippingAddressId }, contextInstance);
}

/**
 * Set the current session's billing address to correspoding to id
 * @throws ClientApiError
 * @category Context
 * @public
 */
export function setCurrentBillingAddress(
  billingAddressId: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<ContextTokenResponse> {
  return updateContext({ billingAddressId }, contextInstance);
}

/**
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getAvailableCurrencies(
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<Currency[]> {
  const { data } = await contextInstance.invoke.get(
    getContextCurrencyEndpoint()
  );

  return data;
}

/**
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function setCurrentCurrency(
  newCurrencyID: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<ContextTokenResponse> {
  const params = { currencyId: newCurrencyID };
  const resp = await updateContext(params, contextInstance);

  return resp;
}

/**
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getAvailableLanguages(
  contextInstance: ShopwareApiInstance = defaultInstance
) {
  const { data } = await contextInstance.invoke.get<
    EntityResult<"language", Language>
  >(getContextLanguageEndpoint());

  return data;
}

/**
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function setCurrentLanguage(
  newLanguageId: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<ContextTokenResponse> {
  const params = { languageId: newLanguageId };
  const resp = await updateContext(params, contextInstance);

  return resp;
}

/**
 * Get all available countries
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getAvailableCountries(
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<EntityResult<"country", Country>> {
  const { data } = await contextInstance.invoke.get<
    EntityResult<"country", Country>
  >(getContextCountryEndpoint());
  return data;
}

/**
 * Get all available salutations
 *
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getAvailableSalutations(
  contextInstance: ShopwareApiInstance = defaultInstance
) {
  const resp = await contextInstance.invoke.get<
    EntityResult<"salutation", Salutation>
  >(getContextSalutationEndpoint());
  return resp.data;
}

/**
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getAvailablePaymentMethods(
  contextInstance: ShopwareApiInstance = defaultInstance,
  params: { onlyAvailable?: boolean } = {}
) {
  const resp = await contextInstance.invoke.get<
    EntityResult<"payment_method", PaymentMethod>
  >(getContextPaymentMethodEndpoint(), {
    params,
  });

  return resp.data;
}

/**
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getPaymentMethodDetails(
  paymentId: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<PaymentMethod> {
  const { data } = await contextInstance.invoke.get(
    getContextPaymentMethodEndpoint(),
    {
      params: {
        "filter[id]": paymentId,
      },
    }
  );

  return data?.elements?.[0];
}

/**
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function setCurrentPaymentMethod(
  newPaymentMethodId: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<ContextTokenResponse> {
  const params = { paymentMethodId: newPaymentMethodId };
  const resp = await updateContext(params, contextInstance);

  return resp;
}

/**
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getAvailableShippingMethods(
  contextInstance: ShopwareApiInstance = defaultInstance,
  params: { onlyAvailable?: boolean } = {}
) {
  const resp = await contextInstance.invoke.get<
    EntityResult<"shipping_method", ShippingMethod>
  >(getContextShippingMethodEndpoint(), {
    params,
  });

  return resp.data;
}

/**
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getShippingMethodDetails(
  shippingId: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<ShippingMethod> {
  const { data } = await contextInstance.invoke.get(
    getContextShippingMethodEndpoint(),
    {
      params: {
        "filter[id]": shippingId,
      },
    }
  );

  return data?.elements?.[0];
}

/**
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function setCurrentShippingMethod(
  newShippingMethodId: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<ContextTokenResponse> {
  const params = { shippingMethodId: newShippingMethodId };
  const resp = await updateContext(params, contextInstance);

  return resp;
}
/**
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getUserCountry(
  countryId: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<Country> {
  const { data } = await contextInstance.invoke.get(
    getContextCountryEndpoint(),
    {
      params: {
        "filter[id]": countryId,
      },
    }
  );

  return data?.elements?.[0];
}

/**
 * @throws ClientApiError
 * @category Context
 * @public
 */
export async function getUserSalutation(
  salutationId: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<Salutation> {
  const { data } = await contextInstance.invoke.get(
    getContextSalutationEndpoint(),
    {
      params: {
        "filter[id]": salutationId,
      },
    }
  );

  return data?.elements?.[0];
}
