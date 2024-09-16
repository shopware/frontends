import { describe, expect, it, vi } from "vitest";
import { useAddress } from "./useAddress";
import { useSetup } from "../_test";
import type { Schemas } from "#shopware";
import { ApiClientError } from "@shopware/api-client";
import type { FetchResponse } from "ofetch";

const MOCKED_ADDRESS = {
  countryId: "6777d83705454d078fc9a7419296c7dc",
  countryStateId: "",
  salutationId: "d5e543063dd642b48ef94b02d68e5785",
  firstName: "Test",
  lastName: "Test",
  zipcode: "123-1234",
  city: "city test",
  street: "test street address",
};

describe("useAddress", () => {
  it("load customer address", async () => {
    const { vm, injections } = await useSetup(useAddress);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.loadCustomerAddresses();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("listAddress"),
      expect.objectContaining({}),
    );
  });

  it("load customer address - error", async () => {
    const { vm } = await useSetup(useAddress, {
      apiClient: {
        invoke: vi.fn().mockImplementation(() => {
          throw new ApiClientError({
            status: 403,
            _data: {
              errors: [
                {
                  code: "TEST",
                  status: 403,
                  detail: "Forbidden",
                },
              ],
            },
          } as unknown as FetchResponse<{ errors: Array<{ title: string }> }>);
        }),
      },
    });

    await expect(vm.loadCustomerAddresses()).rejects.toThrowError();
  });

  it("create address", async () => {
    const { vm, injections } = await useSetup(useAddress);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    // Check types
    await vm.createCustomerAddress(
      MOCKED_ADDRESS as Schemas["CustomerAddress"],
    );

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("createCustomerAddress"),
      expect.objectContaining({ body: MOCKED_ADDRESS }),
    );
  });

  it("update address", async () => {
    const { vm, injections } = await useSetup(useAddress);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.updateCustomerAddress(
      MOCKED_ADDRESS as Schemas["CustomerAddress"],
    );

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("updateCustomerAddress"),
      expect.objectContaining({ body: MOCKED_ADDRESS }),
    );
  });

  it("delete address", async () => {
    const { vm, injections } = await useSetup(useAddress);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.deleteCustomerAddress("address-id");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("deleteCustomerAddress"),
      expect.objectContaining({ pathParams: { addressId: "address-id" } }),
    );
  });

  it("set default billing address", async () => {
    const { vm, injections } = await useSetup(useAddress);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.setDefaultCustomerBillingAddress("address-id");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("defaultBillingAddress"),
      expect.objectContaining({ pathParams: { addressId: "address-id" } }),
    );
  });

  it("set default shipping address", async () => {
    const { vm, injections } = await useSetup(useAddress);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.setDefaultCustomerShippingAddress("address-id");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("defaultShippingAddress"),
      expect.objectContaining({ pathParams: { addressId: "address-id" } }),
    );
  });

  it("build error message builder", async () => {
    const { vm } = await useSetup(useAddress);
    const message = vm.errorMessageBuilder({
      code: "TEST",
    });

    expect(message).toBe(null);

    const messageBlank = vm.errorMessageBuilder({
      code: "VIOLATION::IS_BLANK_ERROR",
      source: {
        pointer: "/data/attributes/firstName",
      },
      detail: "This value should not be blank.",
    });

    expect(messageBlank).toBe(
      "data/attributes/firstName - This value should not be blank.",
    );
  });
});
