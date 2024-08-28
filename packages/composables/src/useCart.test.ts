import { describe, expect, it, beforeEach, vi } from "vitest";
import { useCart } from "./useCart";
import { useSetup } from "./_test";
import type { operations, Schemas } from "#shopware";
import Cart from "./mocks/Cart";

describe("useCart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const itemsMock: operations["addLineItem post /checkout/cart/line-item"]["body"] =
    {
      items: [
        {
          id: "01893ed931d571718e8138e7df7d68d1",
          quantity: 1,
          referencedId: "e05e9340aff4484f9009646dfd572df9",
          type: "product",
        },
        {
          id: "01893ed931d571718e8138e7dfda5264",
          quantity: 1,
          referencedId: "482ce99edecd4579ab1a2c1807bf27d7",
          type: "product",
        },
        {
          id: "01893ed931d571718e8138e7dffd39c6",
          quantity: 2,
          referencedId: "b369bdcbfd0846acbbd8657b8dd18787",
          type: "product",
        },
      ],
    };

  const { vm, injections } = useSetup(useCart);
  injections.apiClient.invoke.mockResolvedValue({
    data: {},
  });

  it("add single product", async () => {
    expect(vm.cartItems).toEqual([]);
    expect(vm.totalPrice).toBe(0);
    expect(vm.subtotal).toBe(0);
    await vm.addProduct({
      id: itemsMock.items[0].referencedId as string,
      quantity: itemsMock.items[0].quantity,
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("addLineItem"),
      expect.objectContaining({
        body: {
          items: [
            {
              type: itemsMock.items[0].type,
              id: itemsMock.items[0].referencedId,
              quantity: itemsMock.items[0].quantity,
            },
          ],
        },
      }),
    );

    await vm.addProduct({
      id: itemsMock.items[0].referencedId as string,
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("addLineItem"),
      expect.objectContaining({
        body: {
          items: [
            {
              type: itemsMock.items[0].type,
              id: itemsMock.items[0].referencedId,
              quantity: 0,
            },
          ],
        },
      }),
    );
  });

  it("refresh the cart", async () => {
    await vm.refreshCart();
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readCart"),
    );
  });

  it("refresh the cart - new cart", async () => {
    expect(await vm.refreshCart(Cart as unknown as Schemas["Cart"])).toEqual(
      Cart,
    );

    expect(vm.shippingTotal).toBe(0);
    expect(vm.subtotal).toBe(16.11);
    expect(vm.isVirtualCart).toBe(false);
    expect(vm.totalPrice).toBe(16.11);
  });

  it("add set of products", async () => {
    await vm.addProducts(itemsMock.items);
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("addLineItem"),
      expect.objectContaining({
        body: itemsMock,
      }),
    );
  });

  it("change product quantity", async () => {
    await vm.changeProductQuantity({
      id: itemsMock.items[0].referencedId as string,
      quantity: 4,
    });
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("updateLineItem"),
      expect.objectContaining({
        body: {
          items: [
            {
              id: itemsMock.items[0].referencedId,
              quantity: 4,
            },
          ],
        },
      }),
    );
  });

  it("remove item", async () => {
    await vm.removeItem({
      id: "01893ed931d571718e8138e7df7d68d1",
    } as Schemas["LineItem"]);
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("removeLineItem"),
      expect.objectContaining({
        body: {
          ids: ["01893ed931d571718e8138e7df7d68d1"],
        },
      }),
    );
  });

  it("submitPromotionCode", async () => {
    injections.apiClient.invoke.mockResolvedValue({
      data: {
        lineItems: [
          {
            type: "promotion",
            payload: {
              code: "3a64e872ca404522a2c5d43ebc751e6b",
            },
          },
          {
            type: "product",
            good: true,
            quantity: 1,
            id: "e05e9340aff4484f9009646dfd572df9",
          },
        ],
      },
    });

    await vm.addPromotionCode("PROMO_CODE");
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("addLineItem"),
      expect.objectContaining({
        body: {
          items: [
            {
              referencedId: "PROMO_CODE",
              type: "promotion",
            },
          ],
        },
      }),
    );

    expect(vm.appliedPromotionCodes).toEqual([
      {
        type: "promotion",
        payload: {
          code: "3a64e872ca404522a2c5d43ebc751e6b",
        },
      },
    ]);
    expect(vm.count).toBe(1);
    expect(vm.totalPrice).toBe(0);
  });

  it("handle api cart error", async () => {
    injections.apiClient.invoke.mockResolvedValue({
      data: {
        errors: [
          {
            status: 400,
            code: "CHECKOUT__CART_ITEM_NOT_FOUND",
            detail: "Line item not found",
          },
        ],
      },
    });
    await vm.refreshCart();
    await vm.addProducts(itemsMock.items);
    expect(vm.consumeCartErrors()).toEqual({
      "0": {
        status: 400,
        code: "CHECKOUT__CART_ITEM_NOT_FOUND",
        detail: "Line item not found",
      },
    });

    expect(vm.consumeCartErrors()).toEqual(null);
  });
});
