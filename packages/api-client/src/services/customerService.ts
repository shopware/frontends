import {
  getCustomerEndpoint,
  getCustomerAddressEndpoint,
  getCustomerUpdateEmailEndpoint,
  getCustomerRegisterEndpoint,
  getCustomerDetailsUpdateEndpoint,
  getCustomerUpdatePasswordEndpoint,
  getCustomerResetPasswordEndpoint,
  getCustomerDefaultBillingAddressEndpoint,
  getCustomerDefaultShippingAddressEndpoint,
  getCustomerLogoutEndpoint,
  getCustomerLoginEndpoint,
  getCustomerOrderEndpoint,
  getCustomerAddAddressEndpoint,
  getConfirmPasswordResetEndpoint,
  getCustomerAccountConfirmEndpoint,
  getCustomerUpdatePaymentMethodEndpoint,
  getNewsletterRecipientEndpoint,
} from "../endpoints";
import { defaultInstance, ShopwareApiInstance } from "../apiService";
import {
  Customer,
  CustomerAddress,
  CustomerRegistrationParams,
  ContextTokenResponse,
  Order,
  EntityResult,
  ShopwareSearchParams,
  ClientApiError,
} from "@shopware-pwa/types";

/**
 * @category Customer
 * @public
 */
export interface CustomerRegisterResponse {
  data: string;
}

/**
 * Register a customer
 *
 * @param params CustomerRegistrationParams
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function register(
  params: CustomerRegistrationParams,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<Customer> {
  const resp = await contextInstance.invoke.post(
    getCustomerRegisterEndpoint(),
    params,
  );
  return resp.data;
}

/**
 * Login user to shopware instance.
 *
 * @param {object} parameters username and password
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function login(
  parameters: { username?: string; password?: string } = {},
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<ContextTokenResponse> {
  const resp = await contextInstance.invoke.post(
    getCustomerLoginEndpoint(),
    parameters,
  );
  const contextToken =
    resp.data["sw-context-token"] || resp.data["contextToken"];
  return { contextToken };
}

/**
 * End up the user session.
 *
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function logout(
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<void> {
  await contextInstance.invoke.post(getCustomerLogoutEndpoint());
}

/**
 * Get customer's object
 *
 * @param parameters ShopwareSearchParams
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function getCustomer(
  parameters: ShopwareSearchParams = {},
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<Customer | null> {
  try {
    const resp = await contextInstance.invoke.post(
      getCustomerEndpoint(),
      parameters,
    );
    return resp.data;
  } catch (e) {
    const err = e as ClientApiError;
    if (err.statusCode === 403) return null;
    throw new Error("Unexpected getCustomerResponse. " + err);
  }
}

/**
 * Get all customer's addresses
 *
 * @param parameters ShopwareSearchParams
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function getCustomerAddresses(
  parameters: ShopwareSearchParams = {},
  contextInstance: ShopwareApiInstance = defaultInstance,
) {
  const resp = await contextInstance.invoke.post<
    EntityResult<"customer_address", CustomerAddress>
  >(getCustomerAddressEndpoint(), parameters);
  return resp.data;
}

type CustomerOrdersResponse = {
  apiAlias: "order-route-response-struct";
  orders: EntityResult<"order", Order>;
  paymentChangeable: Array<unknown>;
};
/**
 * Get all customer's orders
 *
 * @param parameters ShopwareSearchParams
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function getCustomerOrders(
  parameters: ShopwareSearchParams = {},
  contextInstance: ShopwareApiInstance = defaultInstance,
) {
  const resp = await contextInstance.invoke.post<CustomerOrdersResponse>(
    getCustomerOrderEndpoint(),
    parameters,
  );
  return resp.data.orders;
}

/**
 * Get the customer's address by id
 *
 * @param {string} addressId ID of the address
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function getCustomerAddress(
  addressId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<CustomerAddress> {
  const resp = await contextInstance.invoke.get(
    getCustomerAddressEndpoint(addressId),
  );
  return resp.data.data;
}

/**
 * Create an address and respond the new address's id
 *
 * @param {Partial<CustomerAddress>} params address data
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function createCustomerAddress(
  params: Partial<CustomerAddress>,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<CustomerAddress> {
  const resp = await contextInstance.invoke.post(
    getCustomerAddAddressEndpoint(),
    params,
  );
  return resp.data;
}

/**
 * Update an address for specific ID
 *
 * @param {Partial<CustomerAddress>} params address data
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function updateCustomerAddress(
  params: Partial<CustomerAddress>,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<CustomerAddress> {
  const resp = await contextInstance.invoke.patch(
    getCustomerAddressEndpoint(params.id),
    params,
  );
  return resp.data;
}

/**
 * Delete's the customer's address by id
 *
 * @param {string} addressId ID of the address
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function deleteCustomerAddress(
  addressId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<void> {
  await contextInstance.invoke.delete(getCustomerAddressEndpoint(addressId));
}

/**
 * Set address as default
 *
 * @param {string} addressId ID of the address
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function setDefaultCustomerBillingAddress(
  addressId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<string> {
  const response = await contextInstance.invoke.patch(
    getCustomerDefaultBillingAddressEndpoint(addressId),
  );
  return response.data;
}

/**
 * Set address as default
 *
 * @param {string} addressId ID of the address
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function setDefaultCustomerShippingAddress(
  addressId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<string> {
  const response = await contextInstance.invoke.patch(
    getCustomerDefaultShippingAddressEndpoint(addressId),
  );
  return response.data;
}

/**
 * @category Customer
 * @public
 */
export interface CustomerUpdateEmailParam {
  email: string;
  emailConfirmation: string;
  password: string;
}

/**
 * Update a customer's email
 *
 * @param params CustomerUpdateEmailParam email data
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function updateEmail(
  params: CustomerUpdateEmailParam,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<void> {
  await contextInstance.invoke.post(getCustomerUpdateEmailEndpoint(), params);
}

/**
 * @category Customer
 * @public
 */
export interface CustomerUpdatePasswordParam {
  password: string;
  newPassword: string;
  newPasswordConfirm: string;
}

/**
 * Update a customer's password
 *
 * @param params CustomerUpdatePasswordParam password data
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function updatePassword(
  params: CustomerUpdatePasswordParam,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<void> {
  await contextInstance.invoke.post(
    getCustomerUpdatePasswordEndpoint(),
    params,
  );
}

/**
 * @category Customer
 * @public
 */
export interface CustomerResetPasswordParam {
  email: string;
  storefrontUrl?: string;
}

/**
 * Reset a customer's password
 *
 * @param params CustomerResetPasswordParam password data
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function resetPassword(
  params: CustomerResetPasswordParam,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<void> {
  if (params && !params.storefrontUrl) {
    params.storefrontUrl = contextInstance.config.endpoint;
  }

  await contextInstance.invoke.post(getCustomerResetPasswordEndpoint(), params);
}

/**
 * Confirm a customer's password reset. Set new password for account.
 *
 * @param {object} params new password and hash
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function confirmPasswordReset(
  params: {
    newPassword: string;
    hash: string;
    [key: string]: unknown; // additional params
  },
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<void> {
  if (!params) return;
  await contextInstance.invoke.post(getConfirmPasswordResetEndpoint(), {
    newPasswordConfirm: params.newPassword,
    ...params,
  });
}

/**
 * @category Customer
 * @public
 */
export interface CustomerUpdateProfileParam {
  firstName: string;
  lastName: string;
  salutationId: string;
  title: string | null;
}

/**
 * Update a customer's profile data
 *
 * @param {object} params profile data
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function updateProfile(
  params: CustomerUpdateProfileParam,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<void> {
  await contextInstance.invoke.post(getCustomerDetailsUpdateEndpoint(), params);
}

/**
 * Confirm an account registration in double opt-in mode
 *
 * @param params hash and em tokens
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function confirmAccountRegistration(
  params: {
    hash: string;
    em: string;
  },
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<Customer> {
  const response = await contextInstance.invoke.post(
    getCustomerAccountConfirmEndpoint(),
    params,
  );
  return response.data;
}

/**
 * Set payment method under provided ID as default
 *
 * @param {string} paymentMethodId ID of the payment method
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function setDefaultCustomerPaymentMethod(
  paymentMethodId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<{
  success: boolean;
}> {
  const response = await contextInstance.invoke.post(
    getCustomerUpdatePaymentMethodEndpoint(paymentMethodId),
  );
  return response.data;
}

/**
 * Checking if user is newsletter subscriber
 *
 * @param contextInstance ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Customer
 * @public
 */
export async function isNewsletterSubscriber(
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<{
  status: string;
  apiAlias: string;
}> {
  const response = await contextInstance.invoke.post(
    getNewsletterRecipientEndpoint(),
  );
  return response.data;
}
