import { describe, expect, it } from "vitest";
import { useSetup } from "../_test";
import Order from "../mocks/Order";
import { useOrderDetails } from "./useOrderDetails";

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
      email: Order.orders.elements?.[0]?.orderCustomer.email,
      firstName: Order.orders.elements?.[0]?.orderCustomer.firstName,
      lastName: Order.orders.elements?.[0]?.orderCustomer.lastName,
    });

    expect(vm.billingAddress).toEqual(
      Order.orders.elements?.[0]?.addresses.find(
        ({ id }: { id: string }) =>
          id === Order.orders.elements?.[0]?.billingAddressId,
      ),
    );
  });

  it("should handle setting the order payment", async () => {
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

  it("should cancel the order", async () => {
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

  it("getMediaFile", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.getMediaFile("file-123");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("orderDownloadFile"),
      expect.objectContaining({
        accept: "application/octet-stream",
        pathParams: {
          orderId: "123-test",
          downloadId: "file-123",
        },
      }),
    );
  });

  it("getDocumentFile", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.getDocumentFile("file-123", "code-123");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("download"),
      expect.objectContaining({
        pathParams: {
          documentId: "file-123",
          deepLinkCode: "code-123",
        },
      }),
    );
  });

  it("getPaymentMethods", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.getPaymentMethods();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readPaymentMethod"),
      expect.objectContaining({
        body: {
          onlyAvailable: true,
        },
      }),
    );
  });

  it("paymentChangeable", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test", {}));
    injections.apiClient.invoke.mockResolvedValue({ data: Order });
    expect(vm.paymentChangeable).toEqual(false);
    await vm.loadOrderDetails();
    expect(vm.paymentChangeable).toEqual(true);
  });

  it("should return current payment method", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    injections.apiClient.invoke.mockResolvedValue({
      data: {
        orders: {
          elements: [
            {
              transactions: [
                {
                  paymentMethod: {
                    shortName: "invoice_payment",
                  },
                },
                {
                  paymentMethod: {
                    shortName: "cash_payment",
                  },
                },
              ],
            },
          ],
        },
      },
    });
    await vm.loadOrderDetails();
    expect(vm.paymentMethod?.shortName).toEqual("cash_payment");
  });

  it("should return current delivery method", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    injections.apiClient.invoke.mockResolvedValue({
      data: {
        orders: {
          elements: [
            {
              deliveries: [
                {
                  shippingMethod: {
                    name: "test",
                  },
                },
                {
                  shippingMethod: {
                    name: "Standard",
                  },
                },
              ],
            },
          ],
        },
      },
    });
    await vm.loadOrderDetails();
    expect(vm.shippingMethod?.name).toEqual("Standard");
  });

  it("should return undefined if payment method does not exists", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    injections.apiClient.invoke.mockResolvedValue({
      data: {
        orders: {
          elements: [
            {
              transactions: [],
            },
          ],
        },
      },
    });
    await vm.loadOrderDetails();
    expect(vm.paymentMethod?.shortName).toEqual(undefined);
  });

  it("should return undefined if shipping method does not exists", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    injections.apiClient.invoke.mockResolvedValue({
      data: {
        orders: {
          elements: [
            {
              deliveries: [],
            },
          ],
        },
      },
    });
    await vm.loadOrderDetails();
    expect(vm.shippingMethod?.name).toEqual(undefined);
  });
});
