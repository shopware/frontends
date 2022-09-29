import { ref, Ref, computed, unref, ComputedRef } from "vue";
import { Product, Cart, LineItem } from "@shopware-pwa/types";
import { useCart } from "./useCart";

export type UseAddToCartReturn = {
  /**
   * Add to cart method
   */
  addToCart: () => Promise<Cart>;
  /**
   * If you want to add more that 1 product set quantity before invoking `addToCart`
   */
  quantity: Ref<number>;
  /**
   * Returns product count in stock
   */
  getStock: ComputedRef<number | null>;
  /**
   * Returns product count in available stock
   */
  getAvailableStock: ComputedRef<number | null>;
  /**
   * Flag if product is already in cart
   */
  isInCart: ComputedRef<boolean>;
};

export function useAddToCart(
  product: Ref<Product> | Product
): UseAddToCartReturn {
  const unrefProduct = unref(product);
  if (!unrefProduct?.id) {
    throw "Product has to be passed as a composable argument and needs to have an id property.";
  }

  const { addProduct, cartItems } = useCart();
  const quantity: Ref<number> = ref(1);

  async function addToCart(): Promise<Cart> {
    if (!quantity.value) quantity.value = 1;
    const addToCartResponse = await addProduct({
      id: unrefProduct.id,
      quantity: quantity.value,
    });
    quantity.value = 1;
    return addToCartResponse;
  }

  const getStock = computed(() => unrefProduct?.stock);

  const getAvailableStock = computed(() => unrefProduct.availableStock);

  const isInCart = computed(() =>
    cartItems.value.some(
      (item: LineItem) => item.referencedId === unrefProduct.id
    )
  );

  return {
    addToCart,
    quantity,
    getStock,
    getAvailableStock,
    isInCart,
  };
}
