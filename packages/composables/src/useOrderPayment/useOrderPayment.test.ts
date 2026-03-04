import { describe, expect, it } from "vitest";
import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { Schemas } from "#shopware";
import { useSetup } from "../_test";
import Order from "../mocks/Order";
import { useOrderPayment } from "./useOrderPayment";

describe("useOrderPayment", () => {
  it("should handle the order payment", async () => {
    const { vm, injections } = useSetup(() =>
      useOrderPayment(
        computed(() => Order.orders.elements?.[0]) as unknown as ComputedRef<
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
          orderId: Order.orders.elements?.[0]?.id,
        },
      }),
    );

    expect(vm.activeTransaction).toEqual(
      Order.orders.elements?.[0]?.transactions[0],
    );
    expect(vm.paymentMethod).toBeDefined();
    expect(vm.state).toBeDefined();

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
    const { vm, injections } = useSetup(() =>
      useOrderPayment(
        computed(() => null) as unknown as ComputedRef<Schemas["Order"]>,
      ),
    );
    await expect(vm.changePaymentMethod("test")).resolves.toBeUndefined();
    await expect(vm.handlePayment()).resolves.toBeUndefined();
    expect(injections.apiClient.invoke).not.toHaveBeenCalled();
  });

  it("handlePayment returns response", async () => {
    const { vm, injections } = useSetup(() =>
      useOrderPayment(
        computed(() => Order.orders.elements?.[0]) as unknown as ComputedRef<
          Schemas["Order"]
        >,
      ),
    );
    const response = { data: { redirectUrl: "https://pay.example.com" } };
    injections.apiClient.invoke.mockResolvedValue(response);
    const result = await vm.handlePayment();

    expect(result).toEqual(response);
    expect(vm.paymentUrl).toBe("https://pay.example.com");
  });

  it("changePaymentMethod returns response data", async () => {
    const { vm, injections } = useSetup(() =>
      useOrderPayment(
        computed(() => Order.orders.elements?.[0]) as unknown as ComputedRef<
          Schemas["Order"]
        >,
      ),
    );
    const responseData = { success: true };
    injections.apiClient.invoke.mockResolvedValue({ data: responseData });
    const result = await vm.changePaymentMethod("new-method-id");

    expect(result).toEqual(responseData);
  });

  it("should be a asynchronous payment", () => {
    const { vm } = useSetup(() =>
      useOrderPayment(
        computed(() => ({
          ...Order.orders.elements?.[0],
          transactions: [
            {
              paymentMethod: {
                active: true,
                asynchronous: true,
                afterOrderEnabled: true,
              },
            },
          ],
        })) as unknown as ComputedRef<Schemas["Order"]>,
      ),
    );

    expect(vm.isAsynchronous).toBe(true);
  });

  it("should be synchronous when afterOrderEnabled is false", () => {
    const { vm } = useSetup(() =>
      useOrderPayment(
        computed(() => ({
          transactions: [
            {
              paymentMethod: {
                active: true,
                asynchronous: true,
                afterOrderEnabled: false,
              },
            },
          ],
        })) as unknown as ComputedRef<Schemas["Order"]>,
      ),
    );

    expect(vm.isAsynchronous).toBeFalsy();
  });
});
