import { computed, ComputedRef, Ref, unref } from "vue";
import {
  removeCartItem,
  changeCartItemQuantity,
  getProduct,
} from "@shopware-pwa/api-client";
import {
  Product,
  LineItem,
  LineItemType,
  ClientApiError,
  PropertyGroupOptionCart,
  PropertyGroupOption,
  ProductResponse,
} from "@shopware-pwa/types";

import { getMainImageUrl } from "@shopware-pwa/helpers-next";
import { useShopwareContext, useCart } from ".";

export type UseCartItemReturn = {
  itemRegularPrice: ComputedRef<number | undefined>;
  itemSpecialPrice: ComputedRef<number | undefined>;
  itemImageThumbnailUrl: ComputedRef<string>;
  itemOptions: ComputedRef<PropertyGroupOption[] | PropertyGroupOptionCart[]>;
  itemType: ComputedRef<LineItemType | undefined>;
  isProduct: ComputedRef<boolean>;
  isPromotion: ComputedRef<boolean>;
  itemStock: ComputedRef<number | undefined>;

  itemQuantity: ComputedRef<number | undefined>;
  changeItemQuantity: (quantity: number) => Promise<void>;
  removeItem: () => Promise<void>;
  getProductItemSeoUrlData(): Promise<ProductResponse | undefined>;
};

export function useCartItem(cartItem: LineItem): UseCartItemReturn {
  if (!cartItem) {
    throw new Error("[useCartItem] mandatory cartItem argument is missing.");
  }

  const { apiInstance } = useShopwareContext();
  const { refreshCart } = useCart();

  const itemQuantity = computed(() => cartItem.quantity);
  const itemImageThumbnailUrl = computed(() => getMainImageUrl(cartItem));

  // TODO: use helper instead

  const itemRegularPrice = computed(() => cartItem.price?.unitPrice);

  const itemSpecialPrice = computed(
    () => cartItem.price?.listPrice && cartItem.price.unitPrice
  );

  const itemOptions = computed(
    () =>
      (cartItem.type === "product" && (cartItem.payload as Product)?.options) ||
      []
  );

  const itemStock = computed(() => cartItem.deliveryInformation?.stock);

  const itemType = computed(() => cartItem.type);

  const isProduct = computed(() => cartItem.type === "product");

  const isPromotion = computed(() => cartItem.type === "promotion");

  async function removeItem() {
    const result = await removeCartItem(cartItem.id, apiInstance);
    // broadcastUpcomingErrors(result);
    refreshCart();
  }

  async function changeItemQuantity(quantity: number): Promise<void> {
    const result = await changeCartItemQuantity(
      cartItem.id,
      quantity,
      apiInstance
    );
    // broadcastUpcomingErrors(result);
    refreshCart();
  }

  async function getProductItemSeoUrlData(): Promise<
    ProductResponse | undefined
  > {
    if (!cartItem.referencedId) {
      return;
    }

    try {
      const result = await getProduct(
        cartItem.referencedId,
        {
          // includes: (getDefaults() as any).getProductItemsSeoUrlsData.includes,
          // associations: (getDefaults() as any).getProductItemsSeoUrlsData
          //   .associations,
        },
        apiInstance
      );
      return result.product as unknown as ProductResponse;
    } catch (error) {
      console.error(
        "[useCart][getProductItemsSeoUrlsData]",
        (error as ClientApiError).messages
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
    itemOptions,
    itemStock,
    itemQuantity,
    itemType,
    itemImageThumbnailUrl,
    isProduct,
    isPromotion,
  };
}
