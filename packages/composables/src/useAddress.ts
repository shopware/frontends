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

import { CustomerAddress, ShopwareSearchParams } from "@shopware-pwa/types";
import { useUser } from "./useUser";

export type UseAddressReturn = {
  /**
   * List of customer addresses
   */
  customerAddresses: ComputedRef<CustomerAddress[]>;
  /**
   * Loads the addresses that are available under `customerAddresses` property
   */
  loadCustomerAddresses: () => Promise<void>;
  /**
   * Allows to create new address for a current customer
   */
  createCustomerAddress: (
    customerAddress: CustomerAddress
  ) => Promise<CustomerAddress>;
  /**
   * Allows to update existing address for a current customer
   */
  updateCustomerAddress: (
    customerAddress: CustomerAddress
  ) => Promise<CustomerAddress>;
  /**
   * Allows to delete existing address for a current customer
   */
  deleteCustomerAddress: (addressId: string) => Promise<void>;
  /**
   * Sets the address for given ID as default billing address
   */
  setDefaultCustomerBillingAddress: (addressId: string) => Promise<string>;
  /**
   * Sets the address for given ID as default shipping address
   */
  setDefaultCustomerShippingAddress: (addressId: string) => Promise<string>;
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
  const { isLoggedIn, isGuestSession } = useUser();

  const _storeCustomerAddresses: Ref<CustomerAddress[]> = inject(
    "swCustomerAddresses",
    ref([])
  );
  provide("swCustomerAddresses", _storeCustomerAddresses);

  watch(isLoggedIn, () => {
    _storeCustomerAddresses.value = [];
    loadCustomerAddresses();
  });

  /**
   * Get customer address list
   */
  async function loadCustomerAddresses(
    parameters: ShopwareSearchParams = {}
  ): Promise<void> {
    const { elements } = await getCustomerAddresses(parameters, apiInstance);
    _storeCustomerAddresses.value = elements;
  }

  /**
   * Add new customer address
   */
  async function createCustomerAddress(
    customerAddress: Omit<CustomerAddress, "id" | "salutation">
  ): Promise<CustomerAddress> {
    const result = await apiCreateCustomerAddress(customerAddress, apiInstance);
    await loadCustomerAddresses();
    return result;
  }

  /**
   * Update customer address
   */
  async function updateCustomerAddress(
    customerAddress: CustomerAddress
  ): Promise<CustomerAddress> {
    const result = await apiUpdateCustomerAddress(customerAddress, apiInstance);
    await loadCustomerAddresses();
    return result;
  }

  /**
   * Delete customer address
   */
  async function deleteCustomerAddress(addressId: string): Promise<void> {
    const result = apiDeleteCustomerAddress(addressId, apiInstance);
    await loadCustomerAddresses();
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

  return {
    customerAddresses: computed(() => _storeCustomerAddresses.value || []),
    loadCustomerAddresses,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    setDefaultCustomerBillingAddress,
    setDefaultCustomerShippingAddress,
  };
}
