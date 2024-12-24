import { describe, expect, it, vi } from "vitest";
import { useOrder } from "./useOrder";
import { useSetup } from "../_test";
import { useOrderDataProvider } from "../useOrderDataProvider/useOrderDataProvider";
import type { Schemas } from "#shopware";
import Order from "../mocks/Order";

vi.mock("../useOrderDataProvider/useOrderDataProvider.ts");

describe("useOrder", () => {
  vi.mocked(useOrderDataProvider).mockReturnValue({
    loadOrderDetails: async () => Order as unknown as Schemas["Order"],
  } as unknown as ReturnType<typeof useOrderDataProvider>);
  it("init details", async () => {
    const { vm } = useSetup(() =>
      useOrder(Order.orders.elements[0] as unknown as Schemas["Order"]),
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

  it("should handle setting the order payment", async () => {
    const { vm, injections } = useSetup(() =>
      useOrder(Order.orders.elements[0] as unknown as Schemas["Order"]),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.handlePayment();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("handlePaymentMethod"),
      expect.objectContaining({
        body: {
          errorUrl: undefined,
          finishUrl: undefined,
          orderId: Order.orders.elements[0].id,
        },
      }),
    );
  });

  it("should cancel the order", async () => {
    const { vm, injections } = useSetup(() =>
      useOrder(Order.orders.elements[0] as unknown as Schemas["Order"]),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.cancel();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("cancelOrder"),
      expect.objectContaining({
        body: {
          orderId: Order.orders.elements[0].id,
        },
      }),
    );
  });

  it("changePaymentMethod", async () => {
    const { vm, injections } = useSetup(() =>
      useOrder(Order.orders.elements[0] as unknown as Schemas["Order"]),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.changePaymentMethod("test");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("orderSetPayment"),
      expect.objectContaining({
        body: {
          orderId: Order.orders.elements[0].id,
          paymentMethodId: "test",
        },
      }),
    );
  });

  it("should set order data", async () => {
    const { vm } = useSetup(() => useOrder());
    vm.asyncSetData(Order.orders.elements[0] as unknown as Schemas["Order"]);

    expect(vm.order).toEqual(Order.orders.elements[0]);
  });
});
