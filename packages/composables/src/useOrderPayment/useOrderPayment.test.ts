import { describe, expect, it } from "vitest";
import { useOrderPayment } from "./useOrderPayment";
import { useSetup } from "../_test";
import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { Schemas } from "#shopware";
import Order from "../mocks/Order";

describe("useOrderPayment", () => {
  it("should handle the order payment", async () => {
    const { vm, injections } = useSetup(() =>
      useOrderPayment(
        computed(() => Order.orders.elements[0]) as unknown as ComputedRef<
          Schemas["Order"]
        >,
      ),
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

    expect(vm.activeTransaction).toEqual(
      Order.orders.elements[0].transactions[0],
    );

    vm.changePaymentMethod("test");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("orderSetPayment"),
      expect.objectContaining({
        body: {
          orderId: "018c6832f1a1731db276839b3f251fc2",
          paymentMethodId: "test",
        },
      }),
    );
  });

  it("should not invoke API calls for empty order", async () => {
    const { vm } = useSetup(() =>
      useOrderPayment(
        computed(() => null) as unknown as ComputedRef<Schemas["Order"]>,
      ),
    );
    expect(vm.changePaymentMethod("test")).resolves.toBeUndefined();
    expect(vm.handlePayment()).resolves.toBeUndefined();
  });

  it("should be a asynchronous payment", () => {
    const { vm } = useSetup(() =>
      useOrderPayment(
        computed(() =>
          Object.assign(Order.orders.elements[0], {
            transactions: [
              {
                paymentMethod: {
                  active: true,
                  asynchronous: true,
                  afterOrderEnabled: true,
                },
              },
            ],
          }),
        ) as unknown as ComputedRef<Schemas["Order"]>,
      ),
    );

    expect(vm.isAsynchronous).toBe(true);
  });
});
