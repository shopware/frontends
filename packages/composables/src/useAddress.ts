import { reactive, ref, Ref, UnwrapRef } from "vue";

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
  CustomerAddress,
  ClientApiError,
  ShopwareError,
  ShopwareSearchParams,
} from "@shopware-pwa/types";

export function useAddress(): {
  customerAddresses: Ref<CustomerAddress[] | null>;
  errors: UnwrapRef<{
    [errorAlias: string]: ShopwareError[];
  }>;
  loadCustomerAddresses: () => Promise<void>;
  createCustomerAddress: (customerAddress: CustomerAddress) => Promise<boolean>;
  updateCustomerAddress: (customerAddress: CustomerAddress) => Promise<boolean>;
  deleteCustomerAddress: (addressId: string) => Promise<boolean>;
  setDefaultCustomerBillingAddress: (addressId: string) => Promise<boolean>;
  setDefaultCustomerShippingAddress: (addressId: string) => Promise<boolean>;
} {
  const { apiInstance } = useShopwareContext();
  const errors: UnwrapRef<{
    [errorAlias: string]: ShopwareError[];
  }> = reactive({
    loadCustomerAddresses: [],
    createCustomerAddress: [],
    updateCustomerAddress: [],
    deleteCustomerAddress: [],
    setDefaultCustomerBillingAddress: [],
    setDefaultCustomerShippingAddress: [],
  });

  const customerAddresses: Ref<CustomerAddress[] | null> = ref(null);

  /**
   * Get customer address list
   */
  const loadCustomerAddresses = async (
    parameters: ShopwareSearchParams = {}
  ): Promise<void> => {
    try {
      errors.loadCustomerAddresses = [];
      const { elements } = await getCustomerAddresses(parameters, apiInstance);
      customerAddresses.value = elements;
    } catch (e) {
      errors.loadCustomerAddresses = (e as ClientApiError).messages;
    }
  };

  /**
   * Add new customer address
   */
  const createCustomerAddress = async (
    customerAddress: CustomerAddress
  ): Promise<boolean> => {
    try {
      errors.createCustomerAddress = [];
      await apiCreateCustomerAddress(customerAddress, apiInstance);
    } catch (e) {
      errors.createCustomerAddress = (e as ClientApiError).messages;
      return false;
    }
    return true;
  };

  /**
   * Update customer address
   */
  const updateCustomerAddress = async (
    customerAddress: CustomerAddress
  ): Promise<boolean> => {
    try {
      errors.updateCustomerAddress = [];
      await apiUpdateCustomerAddress(customerAddress, apiInstance);
    } catch (e) {
      errors.updateCustomerAddress = (e as ClientApiError).messages;
      return false;
    }
    return true;
  };

  /**
   * Delete customer address
   */
  const deleteCustomerAddress = async (addressId: string): Promise<boolean> => {
    try {
      errors.deleteCustomerAddress = [];
      await apiDeleteCustomerAddress(addressId, apiInstance);
    } catch (e) {
      errors.deleteCustomerAddress = (e as ClientApiError).messages;
      return false;
    }
    return true;
  };

  /**
   * Set default customer billing address
   */
  const setDefaultCustomerBillingAddress = async (
    addressId: string
  ): Promise<boolean> => {
    try {
      errors.setDefaultCustomerBillingAddress = [];
      await apiSetDefaultCustomerBillingAddress(addressId, apiInstance);
    } catch (e) {
      errors.setDefaultCustomerBillingAddress = (e as ClientApiError).messages;
      return false;
    }
    return true;
  };

  /**
   * Set default customer shipping address
   */
  const setDefaultCustomerShippingAddress = async (
    addressId: string
  ): Promise<boolean> => {
    try {
      errors.setDefaultCustomerShippingAddress = [];
      await apiSetDefaultCustomerShippingAddress(addressId, apiInstance);
    } catch (e) {
      errors.setDefaultCustomerShippingAddress = (e as ClientApiError).messages;
      return false;
    }
    return true;
  };

  return {
    customerAddresses,
    errors,
    loadCustomerAddresses,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    setDefaultCustomerBillingAddress,
    setDefaultCustomerShippingAddress,
  };
}
