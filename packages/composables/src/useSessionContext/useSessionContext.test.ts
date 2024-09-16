import { describe, expect, it, vi } from "vitest";
import { useSessionContext } from "./useSessionContext";
import { useSetup } from "../_test";
import type { Schemas } from "#shopware";

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
    vm.setShippingMethod({ id: "test" });
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

    expect(vm.setShippingMethod({ id: undefined })).rejects.toThrowError(
      "You need to provide shipping method id in order to set shipping method.",
    );
  });

  it("setPaymentMethod", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.setPaymentMethod({ id: "test" });
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

    expect(vm.setPaymentMethod({ id: "" })).rejects.toThrowError(
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

  it("setActiveShippingAddress", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.setActiveShippingAddress({ id: "test" });
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
    expect(vm.setActiveShippingAddress({ id: "" })).rejects.toThrowError(
      "You need to provide address id in order to set the address.",
    );
  });

  it("setActiveBillingAddress", async () => {
    const { vm, injections } = useSetup(() => useSessionContext());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.setActiveBillingAddress({ id: "test" });
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
    expect(vm.setActiveBillingAddress({ id: "" })).rejects.toThrowError(
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
});
