import { ApiClientError } from "@shopware/api-client";
import type { FetchResponse } from "ofetch";
import { describe, expect, it, vi } from "vitest";
import type { Schemas } from "#shopware";
import { useSetup } from "../_test";
import { useAddress } from "./useAddress";

const MOCKED_ADDRESS = {
  id: "address-id",
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
    injections.apiClient.invoke.mockResolvedValue({
      data: { elements: [MOCKED_ADDRESS] },
    });
    const result = await vm.loadCustomerAddresses();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("listAddress"),
      expect.objectContaining({}),
    );
    expect(result).toEqual([MOCKED_ADDRESS]);
    expect(vm.customerAddresses).toEqual([MOCKED_ADDRESS]);
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
    expect(vm.customerAddresses).toEqual([]);
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

  it("load customer address - ApiClientError non-403", async () => {
    const { vm } = await useSetup(useAddress, {
      apiClient: {
        invoke: vi.fn().mockImplementation(() => {
          throw new ApiClientError({
            status: 500,
            _data: {
              errors: [{ code: "SERVER", status: 500, detail: "Error" }],
            },
          } as unknown as FetchResponse<{
            errors: Array<{ title: string }>;
          }>);
        }),
      },
    });

    await expect(vm.loadCustomerAddresses()).rejects.toThrowError();
  });

  it("load customer address - non-ApiClientError", async () => {
    const { vm } = await useSetup(useAddress, {
      apiClient: {
        invoke: vi.fn().mockImplementation(() => {
          throw new Error("Network error");
        }),
      },
    });

    await expect(vm.loadCustomerAddresses()).rejects.toThrowError(
      "Network error",
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
