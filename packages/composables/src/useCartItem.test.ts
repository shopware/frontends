import { useCartItem } from "./useCartItem";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSetup } from "./_test";
import { ref } from "vue";
import type { Ref } from "vue";
import type { Schemas } from "#shopware";
import Cart from "./mocks/Cart";

const lineItem = Cart.lineItems[0];

const removeItemSpy = vi.fn();
const changeProductQuantitySpy = vi.fn();
vi.mock("./useCart.ts", async () => {
  return {
    useCart: () => {
      return {
        removeItem: removeItemSpy,
        changeProductQuantity: changeProductQuantitySpy,
      };
    },
  };
});

describe("useCartItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it("should show item options", async () => {
    const payload = {
      options: [
        {
          group: "test",
          option: "test",
          translated: {
            group: "test",
            option: "test",
          },
        },
      ],
    } as Schemas["ProductJsonApi"];

    const { vm } = useSetup(() =>
      useCartItem(
        ref({
          type: "product",
          payload,
        } as Schemas["LineItem"]),
      ),
    );

    expect(vm.itemOptions).toStrictEqual(payload.options);
  });

  it("should show default empty options", async () => {
    const payload = {} as Schemas["ProductJsonApi"];

    const { vm } = useSetup(() =>
      useCartItem(
        ref({
          type: "product",
          payload,
        } as Schemas["LineItem"]),
      ),
    );

    expect(vm.itemOptions).toStrictEqual([]);
  });

  it("should remove item from the cart", async () => {
    const { vm } = useSetup(() =>
      useCartItem(ref(lineItem) as unknown as Ref<Schemas["LineItem"]>),
    );
    const mockedResponse = {
      test: 123,
    };
    removeItemSpy.mockResolvedValueOnce(mockedResponse);
    const result = await vm.removeItem();

    expect(removeItemSpy).toHaveBeenCalledWith(lineItem);
    expect(result).toEqual(mockedResponse);
  });

  it("should change item quantity", async () => {
    const { vm } = useSetup(() =>
      useCartItem(ref(lineItem) as unknown as Ref<Schemas["LineItem"]>),
    );
    const mockedResponse = {
      test: 123,
    };
    changeProductQuantitySpy.mockResolvedValueOnce(mockedResponse);
    const result = await vm.changeItemQuantity(5);

    expect(changeProductQuantitySpy).toHaveBeenCalledWith({
      quantity: 5,
      id: lineItem.id,
    });
    expect(result).toEqual(mockedResponse);

    // @ts-expect-error it should not be allowed by typescript, but still should work properly
    vm.changeItemQuantity("6");
    expect(changeProductQuantitySpy).toHaveBeenCalledWith({
      quantity: 6,
      id: lineItem.id,
    });
  });

  it("itemSpecialPrice", () => {
    const { vm } = useSetup(() =>
      useCartItem(
        ref(
          Object.assign(
            { ...lineItem },
            {
              price: {
                listPrice: {
                  price: 10,
                },
                unitPrice: 5,
              },
            },
          ),
        ) as unknown as Ref<Schemas["LineItem"]>,
      ),
    );
    expect(vm.itemSpecialPrice).toBe(5);
  });
  it("itemRegularPrice from listPrice", () => {
    const { vm } = useSetup(() =>
      useCartItem(
        ref({
          price: {
            listPrice: {
              price: 10,
            },
          },
        }) as unknown as Ref<Schemas["LineItem"]>,
      ),
    );
    expect(vm.itemRegularPrice).toBe(10);
  });

  it("should throw an error if cartItem is not provided", () => {
    expect(() =>
      // @ts-expect-error we deliberately pass null to invoke error
      useCartItem(null),
    ).toThrow("[useCartItem] mandatory cartItem argument is missing.");
  });
});
