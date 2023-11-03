import { computed, ComputedRef, Ref } from "vue";
import { removeCartItem, getProduct } from "@shopware-pwa/api-client";
import type {
  LineItem,
  LineItemType,
  ClientApiError,
  PropertyGroupOptionCart,
  ProductResponse,
  CartProductItem,
  Cart,
} from "@shopware-pwa/types";

import { getMainImageUrl } from "@shopware-pwa/helpers-next";
import { useShopwareContext, useCart } from ".";

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
  itemOptions: ComputedRef<PropertyGroupOptionCart[]>;
  /**
   * Type of the current item: "product" or "promotion"
   */
  itemType: ComputedRef<LineItemType | undefined>;
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
  changeItemQuantity(quantity: number): Promise<Cart>;
  /**
   * Removes the current item from the cart
   */
  removeItem(): Promise<void>;
  /**
   * Get SEO data for the current item
   *
   * @deprecated
   */
  getProductItemSeoUrlData(): Promise<ProductResponse | undefined>;
};

/**
 * Composable to manage specific cart item
 * @public
 * @category Cart & Checkout
 */
export function useCartItem(cartItem: Ref<LineItem>): UseCartItemReturn {
  if (!cartItem) {
    throw new Error("[useCartItem] mandatory cartItem argument is missing.");
  }

  const { apiInstance } = useShopwareContext();
  const { refreshCart, changeProductQuantity } = useCart();

  const itemQuantity = computed(() => cartItem.value.quantity);
  const itemImageThumbnailUrl = computed(() => getMainImageUrl(cartItem.value));

  const itemRegularPrice = computed(
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
      (cartItem.value.type === "product" &&
        (cartItem.value.payload as CartProductItem)?.options) ||
      [],
  );

  const itemStock = computed(() => cartItem.value.deliveryInformation?.stock);

  const itemType = computed(() => cartItem.value.type);

  const isProduct = computed(() => cartItem.value.type === "product");

  const isPromotion = computed(() => cartItem.value.type === "promotion");

  const isRemovable = computed(() => cartItem.value.removable);

  async function removeItem() {
    const newCart = await removeCartItem(cartItem.value.id, apiInstance);
    await refreshCart(newCart);
  }

  async function changeItemQuantity(quantity: number): Promise<Cart> {
    const result = await changeProductQuantity({
      id: cartItem.value.id,
      quantity: quantity,
    });

    return result;
  }

  /**
   * @deprecated Method is not used anymore and the case should be solved on project level instead due to performance reasons.
   */
  async function getProductItemSeoUrlData(): Promise<
    ProductResponse | undefined
  > {
    if (!cartItem.value.referencedId) {
      return;
    }

    try {
      const result = await getProduct(
        cartItem.value.referencedId,
        {
          // includes: (getDefaults() as any).getProductItemsSeoUrlsData.includes,
          // associations: (getDefaults() as any).getProductItemsSeoUrlsData
          //   .associations,
        },
        apiInstance,
      );
      return result.product as unknown as ProductResponse;
    } catch (error) {
      console.error(
        "[useCart][getProductItemsSeoUrlsData]",
        (error as ClientApiError).messages,
      );
    }

    return;
  }

  return {
    changeItemQuantity,
    removeItem,
    getProductItemSeoUrlData,
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
  };
}
