import { ref, Ref, computed, inject, provide, ComputedRef, watch } from "vue";

import {
  getCustomerAddresses,
  createCustomerAddress as apiCreateCustomerAddress,
  updateCustomerAddress as apiUpdateCustomerAddress,
  deleteCustomerAddress as apiDeleteCustomerAddress,
  setDefaultCustomerShippingAddress as apiSetDefaultCustomerShippingAddress,
  setDefaultCustomerBillingAddress as apiSetDefaultCustomerBillingAddress,
} from "@shopware-pwa/api-client";
import { useShopwareContext } from "./useShopwareContext";

import {
  ClientApiError,
  CustomerAddress,
  ShopwareSearchParams,
  Error,
} from "@shopware-pwa/types";
import { useUser } from "./useUser";

export type UseAddressReturn = {
  /**
   * List of customer addresses
   */
  customerAddresses: ComputedRef<CustomerAddress[]>;
  /**
   * Loads the addresses that are available under `customerAddresses` property
   */
  loadCustomerAddresses(): Promise<void>;
  /**
   * Allows to create new address for a current customer
   */
  createCustomerAddress(
    customerAddress: CustomerAddress
  ): Promise<CustomerAddress>;
  /**
   * Allows to update existing address for a current customer
   */
  updateCustomerAddress(
    customerAddress: CustomerAddress
  ): Promise<CustomerAddress>;
  /**
   * Allows to delete existing address for a current customer
   */
  deleteCustomerAddress(addressId: string): Promise<void>;
  /**
   * Sets the address for given ID as default billing address
   */
  setDefaultCustomerBillingAddress(addressId: string): Promise<string>;
  /**
   * Sets the address for given ID as default shipping address
   */
  setDefaultCustomerShippingAddress(addressId: string): Promise<string>;
  /**
   * Returns formatted error message
   *
   * @param {Error} error
   */
  errorMessageBuilder(error: Error): string | null;
};

/**
 * Composable to manage customer addresses
 *
 * @public
 *
 * @category Cart & Checkout
 */
export function useAddress(): UseAddressReturn {
  const { apiInstance } = useShopwareContext();

  const _storeCustomerAddresses: Ref<CustomerAddress[]> = inject(
    "swCustomerAddresses",
    ref([])
  );
  provide("swCustomerAddresses", _storeCustomerAddresses);

  /**
   * Get customer address list
   */
  async function loadCustomerAddresses(
    parameters: ShopwareSearchParams = {}
  ): Promise<void> {
    try {
      const { elements } = await getCustomerAddresses(parameters, apiInstance);
      _storeCustomerAddresses.value = elements;
    } catch (error) {
      const apiError = error as ClientApiError;
      if (apiError?.statusCode === 403) {
        _storeCustomerAddresses.value = [];
      }
    }
  }

  /**
   * Add new customer address
   */
  async function createCustomerAddress(
    customerAddress: Omit<CustomerAddress, "id" | "salutation">
  ): Promise<CustomerAddress> {
    const result = await apiCreateCustomerAddress(customerAddress, apiInstance);
    return result;
  }

  /**
   * Update customer address
   */
  async function updateCustomerAddress(
    customerAddress: CustomerAddress
  ): Promise<CustomerAddress> {
    const result = await apiUpdateCustomerAddress(customerAddress, apiInstance);
    return result;
  }

  /**
   * Delete customer address
   */
  async function deleteCustomerAddress(addressId: string): Promise<void> {
    const result = apiDeleteCustomerAddress(addressId, apiInstance);
    return result;
  }

  /**
   * Set default customer billing address
   */
  async function setDefaultCustomerBillingAddress(
    addressId: string
  ): Promise<string> {
    return await apiSetDefaultCustomerBillingAddress(addressId, apiInstance);
  }

  /**
   * Set default customer shipping address
   */
  async function setDefaultCustomerShippingAddress(
    addressId: string
  ): Promise<string> {
    return await apiSetDefaultCustomerShippingAddress(addressId, apiInstance);
  }

  /**
   * Returns formatted error message
   *
   * @param {error} error
   * @returns {string | null}
   */
  function errorMessageBuilder(error: Error): string | null {
    switch (error.code) {
      case "VIOLATION::IS_BLANK_ERROR":
        return `${error?.source?.pointer.slice(1)} - ${error.detail}`;
      default:
        return null;
    }
  }

  return {
    customerAddresses: computed(() => _storeCustomerAddresses.value || []),
    loadCustomerAddresses,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    setDefaultCustomerBillingAddress,
    setDefaultCustomerShippingAddress,
    errorMessageBuilder,
  };
}
