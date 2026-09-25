import { ref, useAddToCart, useNotifications } from "#imports";
import type { Schemas } from "#shopware";

const product = ref<Schemas["Product"] | undefined>({
  id: "example-product-id",
  translated: {
    name: "Example product",
  },
} as Schemas["Product"]);

const { addToCart } = useAddToCart(product);
const { pushSuccess } = useNotifications();

const add = async () => {
  await addToCart();
  pushSuccess(`${product.value?.translated?.name ?? "Product"} added to cart`);
};
