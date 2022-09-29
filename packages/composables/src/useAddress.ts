import { computed, ComputedRef, ref, Ref } from "vue";

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

export type UseAddressReturn = {
  customerAddresses: ComputedRef<CustomerAddress[]>;
  loadCustomerAddresses: () => Promise<void>;
  createCustomerAddress: (
    customerAddress: CustomerAddress
  ) => Promise<CustomerAddress>;
  updateCustomerAddress: (
    customerAddress: CustomerAddress
  ) => Promise<CustomerAddress>;
  deleteCustomerAddress: (addressId: string) => Promise<void>;
  setDefaultCustomerBillingAddress: (addressId: string) => Promise<string>;
  setDefaultCustomerShippingAddress: (addressId: string) => Promise<string>;
};

export function useAddress(): UseAddressReturn {
  const { apiInstance } = useShopwareContext();

  const customerAddresses: Ref<CustomerAddress[] | null> = ref(null);

  /**
   * Get customer address list
   */
  async function loadCustomerAddresses(
    parameters: ShopwareSearchParams = {}
  ): Promise<void> {
    const { elements } = await getCustomerAddresses(parameters, apiInstance);
    customerAddresses.value = elements;
  }

  /**
   * Add new customer address
   */
  async function createCustomerAddress(
    customerAddress: CustomerAddress
  ): Promise<CustomerAddress> {
    return await apiCreateCustomerAddress(customerAddress, apiInstance);
  }

  /**
   * Update customer address
   */
  async function updateCustomerAddress(
    customerAddress: CustomerAddress
  ): Promise<CustomerAddress> {
    return await apiUpdateCustomerAddress(customerAddress, apiInstance);
  }

  /**
   * Delete customer address
   */
  async function deleteCustomerAddress(addressId: string): Promise<void> {
    await apiDeleteCustomerAddress(addressId, apiInstance);
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
    customerAddresses: computed(() => customerAddresses.value || []),
    loadCustomerAddresses,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    setDefaultCustomerBillingAddress,
    setDefaultCustomerShippingAddress,
  };
}
