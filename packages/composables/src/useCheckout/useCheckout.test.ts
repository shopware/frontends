import { describe, expect, it } from "vitest";
import { useCheckout } from "./useCheckout";
import { useSetup } from "../_test";

describe("useCheckout", () => {
  it("getShippingMethods - empty", async () => {
    const { vm, injections } = useSetup(useCheckout);
    injections.apiClient.invoke.mockResolvedValue({
      data: { elements: undefined },
    });

    await vm.getShippingMethods();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readShippingMethod"),
      expect.objectContaining({
        body: {
          associations: {
            prices: {},
          },
        },
        query: {
          onlyAvailable: true,
        },
      }),
    );
  });

  it("getShippingMethods", async () => {
    const { vm, injections } = useSetup(useCheckout);
    injections.apiClient.invoke.mockResolvedValue({
      data: { elements: [{ position: 1 }, {}] },
    });

    await vm.getShippingMethods();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readShippingMethod"),
      expect.objectContaining({
        body: {
          associations: {
            prices: {},
          },
        },
        query: {
          onlyAvailable: true,
        },
      }),
    );

    const shippingMethods = await vm.getShippingMethods({ forceReload: true });
    expect(shippingMethods.value).toEqual([{}, { position: 1 }]);

    const shippingMethodsNoReload = await vm.getShippingMethods();
    expect(shippingMethodsNoReload.value).toEqual([{}, { position: 1 }]);
  });

  it("getPaymentMethods", async () => {
    const { vm, injections } = useSetup(useCheckout);
    injections.apiClient.invoke.mockResolvedValue({
      data: { elements: [{ id: "1" }] },
    });

    await vm.getPaymentMethods();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readPaymentMethod"),
      expect.objectContaining({}),
    );
    await vm.getPaymentMethods({
      forceReload: false,
    });
    expect(vm.paymentMethods).toEqual([{ id: "1" }]);
  });

  it("getPaymentMethods - empty", async () => {
    const { vm, injections } = useSetup(useCheckout);
    injections.apiClient.invoke.mockResolvedValue({
      data: { elements: undefined },
    });

    await vm.getPaymentMethods();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readPaymentMethod"),
      expect.objectContaining({}),
    );
    expect(vm.paymentMethods).toEqual([]);
  });

  it("createOrder", async () => {
    const { vm, injections } = useSetup(useCheckout);
    injections.apiClient.invoke.mockResolvedValue({
      data: { elements: [] },
    });

    await vm.createOrder();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("createOrder"),
      expect.objectContaining({}),
    );
  });
});
