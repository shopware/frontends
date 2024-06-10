import { describe, expect, it } from "vitest";
import { useOrderDetails } from "./useOrderDetails";
import { useSetup } from "./_test";
import Order from "./mocks/Order";

describe("useOrderDetails", () => {
  it("init details", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    injections.apiClient.invoke.mockResolvedValue({ data: Order });

    await vm.loadOrderDetails();
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readOrder"),
      expect.objectContaining({}),
    );

    expect(vm.personalDetails).toEqual({
      email: Order.orders.elements[0].orderCustomer.email,
      firstName: Order.orders.elements[0].orderCustomer.firstName,
      lastName: Order.orders.elements[0].orderCustomer.lastName,
    });

    expect(vm.billingAddress).toEqual(
      Order.orders.elements[0].addresses.find(
        ({ id }: { id: string }) =>
          id === Order.orders.elements[0].billingAddressId,
      ),
    );
  });

  it("handlePayment", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.handlePayment();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("handlePaymentMethod"),
      expect.objectContaining({
        body: {
          errorUrl: undefined,
          finishUrl: undefined,
          orderId: "123-test",
        },
      }),
    );
  });

  it("cancel", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.cancel();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("cancelOrder"),
      expect.objectContaining({
        body: {
          orderId: "123-test",
        },
      }),
    );
  });

  it("changePaymentMethod", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.changePaymentMethod("test");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("orderSetPayment"),
      expect.objectContaining({
        body: {
          orderId: "123-test",
          paymentMethodId: "test",
        },
      }),
    );
  });
});
