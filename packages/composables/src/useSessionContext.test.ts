import { describe, expect, it } from "vitest";
import { useSessionContext } from "./useSessionContext";
import { useSetup } from "./_test";

describe("useSessionContext", () => {
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
});
