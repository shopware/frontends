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
});
