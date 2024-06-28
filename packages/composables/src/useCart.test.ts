import { describe, expect, it } from "vitest";
import { useCart } from "./useCart";
import { useSetup } from "./_test";
import type { operations } from "#shopware";

describe("useCart", () => {
  it("adding products", async () => {
    const { vm, injections } = useSetup(useCart);
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
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

    await vm.addProduct({
      id: itemsMock.items[0].referencedId,
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
              referencedId: itemsMock.items[0].referencedId,
              quantity: itemsMock.items[0].quantity,
            },
          ],
        },
      }),
    );

    await vm.addProducts(itemsMock.items);
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("addLineItem"),
      expect.objectContaining({
        body: itemsMock,
      }),
    );
  });
});
