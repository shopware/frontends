import { describe, expect, it } from "vitest";
import { useSetup } from "../_test";
import Order from "../mocks/Order";
import { useOrderDetails } from "./useOrderDetails";

describe("useOrderDetails", () => {
  it("init details", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));

    expect(vm.documents).toStrictEqual([]);

    injections.apiClient.invoke.mockResolvedValue({ data: Order });

    await vm.loadOrderDetails();
    expect(vm.hasDocuments).toBe(false);
    expect(vm.documents).toStrictEqual([]);
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readOrder"),
      expect.objectContaining({
        body: expect.objectContaining({
          associations: expect.anything(),
        }),
      }),
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

    expect(vm.order).toBeDefined();
    expect(vm.status).toBe(
      Order.orders.elements?.[0]?.stateMachineState.translated.name,
    );
    expect(vm.statusTechnicalName).toBe(
      Order.orders.elements?.[0]?.stateMachineState.technicalName,
    );
    expect(vm.shippingAddress).toBeUndefined();
    expect(vm.total).toBe(Order.orders.elements?.[0]?.price?.totalPrice);
    expect(vm.subtotal).toBe(Order.orders.elements?.[0]?.price?.positionPrice);
    expect(vm.shippingCosts).toBe(Order.orders.elements?.[0]?.shippingTotal);
  });

  it("should load order by deep link code when isGuestOrder option is true", async () => {
    const { vm, injections } = useSetup(() =>
      useOrderDetails("VNHzUJi2ioujVWdnCeYzExOihpHcxX3S", undefined, {
        isGuestOrder: true,
      }),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: Order });

    await vm.loadOrderDetails();
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readOrder"),
      expect.objectContaining({
        body: expect.objectContaining({
          filter: [
            {
              field: "deepLinkCode",
              type: "equals",
              value: "VNHzUJi2ioujVWdnCeYzExOihpHcxX3S",
            },
          ],
          checkPromotion: true,
        }),
      }),
    );
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readOrder"),
      expect.objectContaining({
        body: expect.not.objectContaining({
          ids: expect.anything(),
        }),
      }),
    );

    expect(vm.personalDetails).toEqual({
      email: Order.orders.elements?.[0]?.orderCustomer.email,
      firstName: Order.orders.elements?.[0]?.orderCustomer.firstName,
      lastName: Order.orders.elements?.[0]?.orderCustomer.lastName,
    });
  });

  it("should load order by id when isGuestOrder option is false", async () => {
    const { vm, injections } = useSetup(() =>
      useOrderDetails("123-test", undefined, { isGuestOrder: false }),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: Order });

    await vm.loadOrderDetails();
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readOrder"),
      expect.objectContaining({
        body: expect.objectContaining({
          ids: ["123-test"],
          checkPromotion: true,
        }),
      }),
    );
  });

  it("should handle setting the order payment", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    injections.apiClient.invoke.mockResolvedValue({
      data: { redirectUrl: "https://payment.example.com" },
    });
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
    expect(vm.paymentUrl).toBe("https://payment.example.com");
  });

  it("should handle payment with success and error URLs", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.handlePayment("https://success.com", "https://error.com");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("handlePaymentMethod"),
      expect.objectContaining({
        body: {
          orderId: "123-test",
          finishUrl: "https://success.com",
          errorUrl: "https://error.com",
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
    const result = await vm.getPaymentMethods();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readPaymentMethod"),
      expect.objectContaining({
        body: {
          onlyAvailable: true,
        },
      }),
    );
    expect(result).toEqual([]);
  });

  it("getPaymentMethods returns elements when available", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    const paymentMethods = [{ id: "1", name: "Invoice" }];
    injections.apiClient.invoke.mockResolvedValue({
      data: { elements: paymentMethods },
    });
    const result = await vm.getPaymentMethods();

    expect(result).toEqual(paymentMethods);
  });

  it("paymentChangeable", async () => {
    const { vm, injections } = useSetup(() => useOrderDetails("123-test", {}));
    injections.apiClient.invoke.mockResolvedValue({ data: Order });
    expect(vm.paymentChangeable).toEqual(false);
    await vm.loadOrderDetails();
    expect(vm.paymentChangeable).toEqual(true);
  });

  it("loadOrderDetails with custom associations", async () => {
    const customAssociations = { lineItems: { associations: { cover: {} } } };
    const { vm, injections } = useSetup(() =>
      useOrderDetails("123-test", customAssociations),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: Order });
    await vm.loadOrderDetails();

    const call = injections.apiClient.invoke.mock.calls.at(0);
    expect(call).toBeDefined();
    if (call) {
      const args = call[1] as { body: { associations: unknown } };
      expect(call[0]).toContain("readOrder");
      expect(args.body.associations).toMatchObject(customAssociations);
    }
  });

  it("hasDocuments and documents when order has documents", async () => {
    const orderElement = Order.orders.elements[0];
    const orderWithDocs = {
      ...orderElement,
      documents: [{ id: "doc-1", deepLinkCode: "abc" }],
    };
    const { vm, injections } = useSetup(() => useOrderDetails("123-test"));
    injections.apiClient.invoke.mockResolvedValue({
      data: {
        orders: { elements: [orderWithDocs] },
        paymentChangeable: { "123-test": true },
      },
    });
    await vm.loadOrderDetails();

    expect(vm.hasDocuments).toBe(true);
    expect(vm.documents).toStrictEqual([{ id: "doc-1", deepLinkCode: "abc" }]);
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
