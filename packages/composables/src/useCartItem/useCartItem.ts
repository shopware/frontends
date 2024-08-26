import { computed } from "vue";
import type { ComputedRef, Ref } from "vue";
import { getMainImageUrl } from "@shopware-pwa/helpers-next";
import { useCart } from "#imports";
import type { Schemas } from "#shopware";

export type UseCartItemReturn = {
  /**
   * Calculated price {number} for the current item
   */
  itemRegularPrice: ComputedRef<number | undefined>;
  /**
   * Calculated price {number} for the current item if list price is set
   */
  itemSpecialPrice: ComputedRef<number | undefined>;
  /**
   * Total price for the current item of given quantity in the cart
   */
  itemTotalPrice: ComputedRef<number | undefined>;
  /**
   * Thumbnail url for the current item's entity
   */
  itemImageThumbnailUrl: ComputedRef<string>;
  /**
   * Options (of variation) for the current item
   */
  itemOptions: ComputedRef<Schemas["LineItem"]["payload"]["options"]>;
  /**
   * Type of the current item: "product" or "promotion"
   */
  itemType: ComputedRef<Schemas["LineItem"]["type"] | undefined>;
  /**
   * Determines if the current item is a product
   */
  isProduct: ComputedRef<boolean>;
  /**
   * Determines if the current item is a promotion
   */
  isPromotion: ComputedRef<boolean>;
  /**
   * Determines if the current item can be removed from cart
   */
  isRemovable: ComputedRef<boolean>;
  /**
   * Determines if the current item's quantity can be changed
   */
  isStackable: ComputedRef<boolean>;
  /**
   * Determines if the current item is a digital product (to download)
   */
  isDigital: ComputedRef<boolean>;
  /**
   * Stock information for the current item
   */
  itemStock: ComputedRef<number | undefined>;
  /**
   * Quantity of the current item in the cart
   */
  itemQuantity: ComputedRef<number | undefined>;
  /**
   * Changes the current item quantity in the cart
   */
  changeItemQuantity(quantity: number): Promise<Schemas["Cart"]>;
  /**
   * Removes the current item from the cart
   */
  removeItem(): Promise<Schemas["Cart"]>;
};

/**
 * Composable to manage specific cart item
 * @public
 * @category Cart & Checkout
 */
export function useCartItem(
  cartItem: Ref<Schemas["LineItem"]>,
): UseCartItemReturn {
  if (!cartItem) {
    throw new Error("[useCartItem] mandatory cartItem argument is missing.");
  }

  const { changeProductQuantity, removeItem: cartRemoveItem } = useCart();

  const itemQuantity = computed(() => cartItem.value.quantity);
  const itemImageThumbnailUrl = computed(() => getMainImageUrl(cartItem.value));

  const itemRegularPrice = computed<number | undefined>(
    () =>
      cartItem.value?.price?.listPrice?.price ||
      cartItem.value?.price?.unitPrice,
  );

  const itemSpecialPrice = computed(
    () =>
      cartItem.value?.price?.listPrice?.price &&
      cartItem.value?.price?.unitPrice,
  );

  const itemTotalPrice = computed(() => cartItem.value.price?.totalPrice);

  const itemOptions = computed(
    () =>
      (cartItem.value.type === "product" && cartItem.value.payload?.options) ||
      [],
  );

  const itemStock = computed<number>(
    () => cartItem.value.deliveryInformation.stock,
  );

  const isDigital = computed(
    () => !!cartItem.value.states?.includes("is-download"),
  );

  const isStackable = computed(() => !!cartItem.value.stackable);

  const itemType = computed(() => cartItem.value.type);

  const isProduct = computed(() => cartItem.value.type === "product");

  const isPromotion = computed(() => cartItem.value.type === "promotion");

  const isRemovable = computed(() => !!cartItem.value.removable);

  async function removeItem() {
    return await cartRemoveItem(cartItem.value);
  }

  async function changeItemQuantity(
    quantity: number,
  ): Promise<Schemas["Cart"]> {
    const result = changeProductQuantity({
      id: cartItem.value.id,
      quantity: +quantity,
    });

    return result;
  }

  return {
    changeItemQuantity,
    removeItem,
    itemRegularPrice,
    itemSpecialPrice,
    itemTotalPrice,
    itemOptions,
    itemStock,
    itemQuantity,
    itemType,
    itemImageThumbnailUrl,
    isProduct,
    isPromotion,
    isRemovable,
    isStackable,
    isDigital,
  };
}
