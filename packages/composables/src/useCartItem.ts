import { computed } from "vue";
import type { ComputedRef, Ref } from "vue";
import type {
  PropertyGroupOptionCart,
  CartProductItem,
} from "@shopware-pwa/types";

import { getMainImageUrl } from "@shopware-pwa/helpers-next";
import { useShopwareContext, useCart } from "#imports";
import type { Cart, Schemas } from "#shopware";

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
  itemType: ComputedRef<Schemas["LineItem"]["type"] | undefined>; // TODO: [OpenAPI][LineItem] - LineItem type should be required, temporal regression to `string` istead of union type
  /**
   * Determines if the current item is a product
   */
  isProduct: ComputedRef<boolean>;
  /**
   * Determines if the current item is a promotion
   */
  isPromotion: ComputedRef<boolean>;
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
  getProductItemSeoUrlData(): Promise<
    Schemas["ProductDetailResponse"]["product"] | undefined
  >;
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

  const { apiClient } = useShopwareContext();
  const { refreshCart, changeProductQuantity } = useCart();

  const itemQuantity = computed(() => cartItem.value.quantity);
  const itemImageThumbnailUrl = computed(() =>
    getMainImageUrl(cartItem.value as any),
  ); // TODO: [OpenAPI][LineItem] - `cover` should be defined in LineItem schema

  const itemRegularPrice = computed<number | undefined>(
    () =>
      (cartItem.value as any)?.price?.listPrice?.price || // TODO: [OpenAPI][LineItem] - LineItem price should be required and defined
      (cartItem.value as any)?.price?.unitPrice,
  );

  const itemSpecialPrice = computed(
    () =>
      (cartItem.value as any)?.price?.listPrice?.price && // TODO: [OpenAPI][LineItem] - LineItem price should be required and defined
      (cartItem.value as any)?.price?.unitPrice,
  );

  const itemTotalPrice = computed(
    () => (cartItem.value as any).price?.totalPrice, // TODO: [OpenAPI][LineItem] - LineItem price should be required and defined
  );

  const itemOptions = computed(
    () =>
      (cartItem.value.type === "product" &&
        ((cartItem.value as any).payload as CartProductItem)?.options) || // TODO: [OpenAPI][LineItem] - LineItem payload should be required and defined in type `product`
      [],
  );

  const itemStock = computed<number>(
    () => (cartItem.value as any).deliveryInformation?.stock,
  ); // TODO: [OpenAPI][LineItem] - LineItem deliveryInformation should be required and defined

  const itemType = computed(() => cartItem.value.type);

  const isProduct = computed(() => cartItem.value.type === "product");

  const isPromotion = computed(() => cartItem.value.type === "promotion");

  async function removeItem() {
    const newCart = await apiClient.invoke(
      "removeLineItem delete /checkout/cart/line-item?ids",
      {
        ids: [cartItem.value.id as string], // TODO: [OpenAPI][LineItem] - change lineitem id to mandatory
      },
    );
    await refreshCart(newCart);
  }

  async function changeItemQuantity(quantity: number): Promise<Cart> {
    const result = changeProductQuantity({
      id: cartItem.value.id as string, // TODO: [OpenAPI][updateLIneItem] - change id field to mandatory
      quantity: +quantity,
    });

    return result;
  }

  /**
   * @deprecated Method is not used anymore and the case should be solved on project level instead due to performance reasons.
   */
  async function getProductItemSeoUrlData() {
    if (!cartItem.value.referencedId) {
      return;
    }

    try {
      const result = await apiClient.invoke(
        "readProductDetail post /product/{productId}",
        {
          productId: cartItem.value.referencedId,
        },
      );

      return result.product;
    } catch (error) {
      console.error("[useCart][getProductItemsSeoUrlsData]", error);
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
  };
}
