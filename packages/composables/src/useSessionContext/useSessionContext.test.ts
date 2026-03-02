import { describe, expect, it, vi } from "vitest";
import type { Schemas } from "#shopware";
import { useSetup } from "../_test";
import { useSessionContext } from "./useSessionContext";

const consoleErrorSpy = vi.spyOn(console, "error");
consoleErrorSpy.mockImplementation(() => {});

describe("useSessionContext", () => {
  const consoleErrorSpy = vi.spyOn(console, "error");
  it("setLanguage", () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.setLanguage({ id: "test" });
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("updateContext"),
      expect.objectContaining({
        body: {
          languageId: "test",
        },
      }),
    );
  });

  it("setLanguage - no id", () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.setLanguage({ id: "" });
    expect(injections.apiClient.invoke).not.toHaveBeenCalledWith(
      expect.stringContaining("updateContext"),
    );
  });

  it("setCountry", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.setCountry("test");
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("updateContext"),
      expect.objectContaining({
        body: {
          countryId: "test",
        },
      }),
    );
  });

  it("refreshSessionContext", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.refreshSessionContext();
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readContext"),
    );
  });

  it("refreshSessionContext - error", async () => {
    const { vm } = useSetup(() => useSessionContext(), {
      apiClient: {
        invoke: vi.fn().mockImplementation(() => {
          throw new Error("error test");
        }),
      },
    });
    consoleErrorSpy.mockImplementation(() => {});
    await vm.refreshSessionContext();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it("setShippingMethod", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.setShippingMethod({ id: "test" });
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("updateContext"),
      expect.objectContaining({
        body: {
          shippingMethodId: "test",
        },
      }),
    );
  });

  it("setShippingMethod - error", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });

    await expect(vm.setShippingMethod({ id: undefined })).rejects.toThrowError(
      "You need to provide shipping method id in order to set shipping method.",
    );
  });

  it("setShippingMethod - error without id", async () => {
    const { vm } = useSetup(() => useSessionContext());
    await expect(
      vm.setShippingMethod({} as { id: string }),
    ).rejects.toThrowError(
      "You need to provide shipping method id in order to set shipping method.",
    );
  });

  it("setPaymentMethod", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.setPaymentMethod({ id: "test" });
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("updateContext"),
      expect.objectContaining({
        body: {
          paymentMethodId: "test",
        },
      }),
    );
  });

  it("setPaymentMethod - error", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });

    await expect(vm.setPaymentMethod({ id: "" })).rejects.toThrowError(
      "You need to provide payment method id in order to set payment method.",
    );
  });

  it("setPaymentMethod - error without id", async () => {
    const { vm } = useSetup(() => useSessionContext());
    await expect(
      vm.setPaymentMethod({} as { id: string }),
    ).rejects.toThrowError(
      "You need to provide payment method id in order to set payment method.",
    );
  });

  it("setCurrency", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.setCurrency({ id: "test" });
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("updateContext"),
      expect.objectContaining({
        body: {
          currencyId: "test",
        },
      }),
    );
  });

  it("setCurrency - error", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.setCurrency({ id: "" });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("setCurrency - undefined id", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    await vm.setCurrency({ id: undefined } as unknown as { id: string });
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(injections.apiClient.invoke).not.toHaveBeenCalledWith(
      expect.stringContaining("updateContext"),
    );
  });

  it("setActiveShippingAddress", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.setActiveShippingAddress({ id: "test" });
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("updateContext"),
      expect.objectContaining({
        body: {
          shippingAddressId: "test",
        },
      }),
    );
  });

  it("setActiveShippingAddress - error", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await expect(vm.setActiveShippingAddress({ id: "" })).rejects.toThrowError(
      "You need to provide address id in order to set the address.",
    );
  });

  it("setActiveShippingAddress - error without id", async () => {
    const { vm } = useSetup(() => useSessionContext());
    await expect(vm.setActiveShippingAddress({})).rejects.toThrowError(
      "You need to provide address id in order to set the address.",
    );
  });

  it("setActiveBillingAddress", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.setActiveBillingAddress({ id: "test" });
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("updateContext"),
      expect.objectContaining({
        body: {
          billingAddressId: "test",
        },
      }),
    );
  });

  it("setActiveBillingAddress - error", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await expect(vm.setActiveBillingAddress({ id: "" })).rejects.toThrowError(
      "You need to provide address id in order to set the address.",
    );
  });

  it("setActiveBillingAddress - error without id", async () => {
    const { vm } = useSetup(() => useSessionContext());
    await expect(vm.setActiveBillingAddress({})).rejects.toThrowError(
      "You need to provide address id in order to set the address.",
    );
  });

  it("setContext", () => {
    const { vm } = useSetup(() => useSessionContext());
    vm.setContext({
      countryId: "test",
    } as unknown as Schemas["SalesChannelContext"]);
    expect(vm.sessionContext).toStrictEqual({
      countryId: "test",
    });
    expect(vm.activeShippingAddress).toBe(null);
  });

  it("activeShippingAddress - active address", () => {
    const { vm } = useSetup(() => useSessionContext());
    vm.setContext({
      customer: {
        activeShippingAddress: {
          city: "test",
        },
      },
    } as unknown as Schemas["SalesChannelContext"]);

    expect(vm.activeShippingAddress).toStrictEqual({
      city: "test",
    });
  });

  it("activeShippingAddress - shipping location", () => {
    const { vm } = useSetup(() => useSessionContext());
    vm.setContext({
      shippingLocation: {
        address: {
          city: "test",
        },
      },
    } as unknown as Schemas["SalesChannelContext"]);

    expect(vm.activeShippingAddress).toStrictEqual({
      city: "test",
    });
  });

  it("countryId, salesChannelCountryId, languageId, languageIdChain, taxState", () => {
    const { vm } = useSetup(() => useSessionContext());
    vm.setContext({
      shippingLocation: {
        country: { id: "country-1" },
      },
      salesChannel: { countryId: "sales-country-1", languageId: "lang-1" },
      context: { languageIdChain: ["chain-1"], taxState: "net" },
    } as unknown as Schemas["SalesChannelContext"]);

    expect(vm.countryId).toBe("country-1");
    expect(vm.salesChannelCountryId).toBe("sales-country-1");
    expect(vm.languageId).toBe("lang-1");
    expect(vm.languageIdChain).toBe("chain-1");
    expect(vm.taxState).toBe("net");
  });

  it("languageIdChain - empty when no chain", () => {
    const { vm } = useSetup(() => useSessionContext());
    vm.setContext({
      context: {},
    } as unknown as Schemas["SalesChannelContext"]);

    expect(vm.languageIdChain).toBe("");
  });

  it("setLanguage - undefined id", () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    vm.setLanguage({ id: undefined } as unknown as { id: string });
    expect(injections.apiClient.invoke).not.toHaveBeenCalledWith(
      expect.stringContaining("updateContext"),
    );
  });

  it("selectedShippingMethod, selectedPaymentMethod, currency, activeBillingAddress, userFromContext", () => {
    const { vm } = useSetup(() => useSessionContext());

    expect(vm.selectedShippingMethod).toBeNull();
    expect(vm.selectedPaymentMethod).toBeNull();
    expect(vm.currency).toBeNull();
    expect(vm.activeBillingAddress).toBeNull();
    expect(vm.userFromContext).toBeUndefined();

    vm.setContext({
      shippingMethod: { id: "ship-1", name: "Standard" },
      paymentMethod: { id: "pay-1", name: "Invoice" },
      currency: { id: "curr-1", isoCode: "EUR" },
      customer: {
        activeBillingAddress: { city: "Berlin" },
        id: "cust-1",
      },
    } as unknown as Schemas["SalesChannelContext"]);

    expect(vm.selectedShippingMethod).toStrictEqual({
      id: "ship-1",
      name: "Standard",
    });
    expect(vm.selectedPaymentMethod).toStrictEqual({
      id: "pay-1",
      name: "Invoice",
    });
    expect(vm.currency).toStrictEqual({ id: "curr-1", isoCode: "EUR" });
    expect(vm.activeBillingAddress).toStrictEqual({ city: "Berlin" });
    expect(vm.userFromContext).toStrictEqual({
      activeBillingAddress: { city: "Berlin" },
      id: "cust-1",
    });
  });

  it("useSessionContext with initial context", () => {
    const initialContext = {
      shippingLocation: { country: { id: "initial-country" } },
    } as unknown as Schemas["SalesChannelContext"];
    const { vm } = useSetup(() => useSessionContext(initialContext));
    expect(vm.countryId).toBe("initial-country");
  });
});
