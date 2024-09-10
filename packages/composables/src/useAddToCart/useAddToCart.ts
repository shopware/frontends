import { ref, computed, unref } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useCart } from "#imports";
import type { Schemas } from "#shopware";
export type UseAddToCartReturn = {
  /**
   * Add to cart method
   * @type {function}
   */
  addToCart(): Promise<Schemas["Cart"]>;
  /**
   * If you want to add more that 1 product set quantity before invoking `addToCart`
   */
  quantity: Ref<number>;
  /**
   * Returns product count in stock
   */
  getStock: ComputedRef<number | undefined>;
  /**
   * Returns product count in available stock
   */
  getAvailableStock: ComputedRef<number | undefined>;
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
 *
 * With this composable you can:
 * - Add product to cart
 * - Get product quantity
 * - Get product stock
 * - Get product available stock
 * - Check if product is in cart
 * - Get product count in cart
 *
 * @public
 * @category Cart & Checkout
 */
export function useAddToCart(
  product: Ref<Schemas["Product"] | undefined>,
): UseAddToCartReturn {
  const _product = computed(() => unref(product));

  const { addProduct, cartItems } = useCart();
  const quantity: Ref<number> = ref(1);

  async function addToCart(): Promise<Schemas["Cart"]> {
    if (!_product.value?.id) throw new Error("Product id is required");

    const addToCartResponse = await addProduct({
      id: _product.value?.id,
      quantity: quantity.value,
    });
    quantity.value = 1;
    return addToCartResponse;
  }

  const getStock = computed(() => _product.value?.stock);

  const getAvailableStock = computed(() => _product.value?.availableStock);

  const isInCart = computed(() =>
    cartItems.value.some(
      (item: Schemas["LineItem"]) => item.referencedId === _product.value?.id,
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
          (item: Schemas["LineItem"]) =>
            item.referencedId === _product.value?.id,
        )?.quantity || 0,
    ),
  };
}
