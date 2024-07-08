import { describe, expect, it } from "vitest";
import { useOrderPayment } from "./useOrderPayment";
import { useSetup } from "./_test";
import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { Schemas } from "#shopware";
import Order from "./mocks/Order";

describe("useOrderPayment", () => {
  it("handlePayment", async () => {
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
  });
});
