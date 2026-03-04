import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useSetup } from "../_test";
import { useCheckout } from "./useCheckout";

const sessionContextRef = ref();
vi.mock("../useSessionContext/useSessionContext.ts", () => ({
  useSessionContext: () => ({
    sessionContext: sessionContextRef,
    selectedPaymentMethod: ref(null),
    selectedShippingMethod: ref(null),
    setShippingMethod: vi.fn(),
    setPaymentMethod: vi.fn(),
  }),
}));

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

  it("createOrder with params", async () => {
    const { vm, injections } = useSetup(useCheckout);
    injections.apiClient.invoke.mockResolvedValue({
      data: { id: "order-123" },
    });

    const result = await vm.createOrder({ customerComment: "test" });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("createOrder"),
      expect.objectContaining({
        body: { customerComment: "test" },
      }),
    );
    expect(result).toEqual({ id: "order-123" });
  });

  it("shippingAddress and billingAddress from sessionContext", () => {
    const shippingAddr = { street: "Test St", city: "Test City" };
    const billingAddr = { street: "Billing St", city: "Billing City" };
    sessionContextRef.value = {
      shippingLocation: { address: shippingAddr },
      customer: { activeBillingAddress: billingAddr },
    };

    const { vm } = useSetup(useCheckout);
    expect(vm.shippingAddress).toEqual(shippingAddr);
    expect(vm.billingAddress).toEqual(billingAddr);
  });
});
