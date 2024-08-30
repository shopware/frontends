import { ref, computed, inject, provide } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";
import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";

export type UseAddressReturn = {
  /**
   * List of customer addresses
   */
  customerAddresses: ComputedRef<Schemas["CustomerAddress"][]>;
  /**
   * Loads the addresses that are available under `customerAddresses` property
   */
  loadCustomerAddresses(): Promise<Schemas["CustomerAddress"][]>;
  /**
   * Allows to create new address for a current customer
   */
  createCustomerAddress(
    customerAddress: Schemas["CustomerAddress"],
  ): Promise<Schemas["CustomerAddress"]>;
  /**
   * Allows to update existing address for a current customer
   */
  updateCustomerAddress(
    customerAddress: Schemas["CustomerAddress"],
  ): Promise<Schemas["CustomerAddress"]>;
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
   * @param {ShopwareError} error
   */
  errorMessageBuilder(error: ApiError): string | null;
};

/**
 * Composable to manage customer addresses
 *
 * With this composable you can:
 * - Fetch customer addresses
 * - Return customer addresses
 * - Create new customer address
 * - Update existing customer address
 * - Delete existing customer address
 * - Set default billing address
 * - Set default shipping address
 * - Format error message
 *
 * @public
 *
 * @category Cart & Checkout
 */
export function useAddress(): UseAddressReturn {
  const { apiClient } = useShopwareContext();

  const _storeCustomerAddresses: Ref<Schemas["CustomerAddress"][]> = inject(
    "swCustomerAddresses",
    ref([]),
  );
  provide("swCustomerAddresses", _storeCustomerAddresses);

  /**
   * Get customer address list
   */
  async function loadCustomerAddresses(
    parameters: Schemas["Criteria"] = {},
  ): Promise<Schemas["CustomerAddress"][]> {
    try {
      const result = await apiClient.invoke(
        "listAddress post /account/list-address",
        {
          body: parameters,
        },
      );
      _storeCustomerAddresses.value = result.data.elements;
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.status === 403) {
          _storeCustomerAddresses.value = [];
        }
      }
      throw error;
    }
    return _storeCustomerAddresses.value;
  }

  /**
   * Add new customer address
   */
  async function createCustomerAddress(
    customerAddress: Schemas["CustomerAddress"],
  ): Promise<Schemas["CustomerAddress"]> {
    const result = await apiClient.invoke(
      "createCustomerAddress post /account/address",
      {
        body: customerAddress,
      },
    );
    return result.data;
  }

  /**
   * Update customer address
   */
  async function updateCustomerAddress(
    customerAddress: Schemas["CustomerAddress"],
  ): Promise<Schemas["CustomerAddress"]> {
    // customerAddress.addressId = customerAddress.id;

    const result = await apiClient.invoke(
      "updateCustomerAddress patch /account/address/{addressId}",
      {
        pathParams: {
          addressId: customerAddress.id,
        },
        body: customerAddress,
      },
    );
    return result.data;
  }

  /**
   * Delete customer address
   */
  async function deleteCustomerAddress(addressId: string): Promise<void> {
    await apiClient.invoke(
      "deleteCustomerAddress delete /account/address/{addressId}",
      { pathParams: { addressId } },
    );
  }

  /**
   * Set default customer billing address
   */
  async function setDefaultCustomerBillingAddress(
    addressId: string,
  ): Promise<string> {
    const result = await apiClient.invoke(
      "defaultBillingAddress patch /account/address/default-billing/{addressId}",
      {
        pathParams: {
          addressId,
        },
      },
    );
    return result.data;
  }

  /**
   * Set default customer shipping address
   */
  async function setDefaultCustomerShippingAddress(
    addressId: string,
  ): Promise<string> {
    const result = await apiClient.invoke(
      "defaultShippingAddress patch /account/address/default-shipping/{addressId}",
      {
        pathParams: { addressId },
      },
    );
    return result.data;
  }

  /**
   * Returns formatted error message
   *
   * @param {error} error
   * @returns {string | null}
   */
  function errorMessageBuilder(error: ApiError): string | null {
    switch (error.code) {
      case "VIOLATION::IS_BLANK_ERROR":
        return `${error?.source?.pointer?.slice(1)} - ${error.detail}`;
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
