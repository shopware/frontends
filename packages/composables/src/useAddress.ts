import { ref, computed, inject, provide } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useShopwareContext } from "#imports";
import type { RequestParameters, Schemas } from "#shopware";
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
  loadCustomerAddresses(): Promise<void>;
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
  ): Promise<void> {
    try {
      const result = await apiClient.invoke(
        "listAddress post /account/list-address",
        parameters,
      );
      _storeCustomerAddresses.value = result.elements;
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.status === 403) {
          _storeCustomerAddresses.value = [];
        }
      }
    }
  }

  /**
   * Add new customer address
   */
  async function createCustomerAddress(
    customerAddress: RequestParameters<"createCustomerAddress">,
  ): Promise<Schemas["CustomerAddress"]> {
    const result = await apiClient.invoke(
      "createCustomerAddress post /account/address",
      customerAddress,
    );
    return result;
  }

  /**
   * Update customer address
   */
  async function updateCustomerAddress(
    customerAddress: RequestParameters<"updateCustomerAddress">,
  ): Promise<Schemas["CustomerAddress"]> {
    customerAddress.addressId = customerAddress.id;

    const result = await apiClient.invoke(
      "updateCustomerAddress patch /account/address/{addressId}",
      customerAddress,
    );
    return result;
  }

  /**
   * Delete customer address
   */
  async function deleteCustomerAddress(addressId: string): Promise<void> {
    await apiClient.invoke(
      "deleteCustomerAddress delete /account/address/{addressId}",
      { addressId },
    );
  }

  /**
   * Set default customer billing address
   */
  async function setDefaultCustomerBillingAddress(
    addressId: string,
  ): Promise<string> {
    return await apiClient.invoke(
      "defaultBillingAddress patch /account/address/default-billing/{addressId}",
      {
        addressId,
      },
    );
  }

  /**
   * Set default customer shipping address
   */
  async function setDefaultCustomerShippingAddress(
    addressId: string,
  ): Promise<string> {
    return await apiClient.invoke(
      "defaultShippingAddress patch /account/address/default-shipping/{addressId}",
      {
        addressId,
      },
    );
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
