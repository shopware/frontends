import { useCartItem } from "./useCartItem";
import { describe, expect, it } from "vitest";
import { useSetup } from "./_test";
import { ref } from "vue";
import type { Ref } from "vue";
import type { Schemas } from "#shopware";
import Cart from "./mocks/Cart";

const lineItem = Cart.lineItems[0];

describe("useCartItem", () => {
  it("init cart item", () => {
    const { vm } = useSetup(() =>
      useCartItem(ref(lineItem) as unknown as Ref<Schemas["LineItem"]>),
    );
    expect(vm.isProduct).toBe(true);
    expect(vm.isPromotion).toBe(false);
    expect(vm.isRemovable).toBe(true);
    expect(vm.isStackable).toBe(true);
    expect(vm.isDigital).toBe(false);
    expect(vm.itemImageThumbnailUrl).toBe(lineItem.cover?.url);
    expect(vm.itemType).toBe("product");
    expect(vm.itemQuantity).toBe(1);
    expect(vm.itemStock).toBe(49485);
    expect(vm.itemTotalPrice).toBe(17.9);
    expect(vm.itemSpecialPrice).toBe(undefined);
    expect(vm.itemRegularPrice).toBe(17.9);
    expect(vm.itemOptions).toStrictEqual([]);
  });

  it("remove item", () => {
    const { vm, injections } = useSetup(() =>
      useCartItem(ref(lineItem) as unknown as Ref<Schemas["LineItem"]>),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.removeItem();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("removeLineItem"),
      expect.objectContaining({
        body: {
          ids: [lineItem.id],
        },
      }),
    );
  });

  it("get product item seo url data", () => {
    const { vm, injections } = useSetup(() =>
      useCartItem(ref(lineItem) as unknown as Ref<Schemas["LineItem"]>),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.getProductItemSeoUrlData();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readProductDetail"),
      expect.objectContaining({
        pathParams: {
          productId: lineItem.id,
        },
      }),
    );
  });
});
