import { ref, Ref, computed, unref, ComputedRef, watch } from "vue";
import { Product, Cart, LineItem, EntityError } from "@shopware-pwa/types";
import { useCart } from "./useCart";
// prettier-ignore
export type UseAddToCartReturn = {
  /**
   * Add to cart method
   * @type {function}
   */
  addToCart(): Promise<Cart>;
  /**
   * If you want to add more that 1 product set quantity before invoking `addToCart`
   */
  quantity: Ref<number>;
  /**
   * Returns product count in stock
   */
  getStock: ComputedRef<number|undefined>;
  /**
   * Returns product count in available stock
   */
  getAvailableStock: ComputedRef<number | null>;
  /**
   * Flag if product is already in cart
   */
  isInCart: ComputedRef<boolean>;
  /**
   * count of the product quantity already in the cart
   */
  count: ComputedRef<number>;
};

/**
 * Composable to manage adding product to cart
 * @public
 * @category Cart & Checkout
 */
export function useAddToCart(product: Ref<Product>): UseAddToCartReturn {
  const _product = computed(() => unref(product));

  const { addProduct, cartItems } = useCart();
  const quantity: Ref<number> = ref(1);

  async function addToCart(): Promise<Cart> {
    if (!quantity.value) quantity.value = 1;
    const addToCartResponse = await addProduct({
      id: _product.value.id,
      quantity: quantity.value,
    });
    quantity.value = 1;
    return addToCartResponse;
  }

  const getStock = computed(() => _product.value?.stock);

  const getAvailableStock = computed(() => _product.value?.availableStock);

  const isInCart = computed(() =>
    cartItems.value.some(
      (item: LineItem) => item.referencedId === _product.value?.id,
    ),
  );

  return {
    addToCart,
    quantity,
    getStock,
    getAvailableStock,
    isInCart,
    count: computed(
      () =>
        cartItems.value.find(
          (item: LineItem) => item.referencedId === _product.value?.id,
        )?.quantity || 0,
    ),
  };
}
