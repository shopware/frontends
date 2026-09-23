const { addToCart } = useAddToCart(product);
const { pushSuccess } = useNotifications();

const add = async () => {
  await addToCart();
  pushSuccess(`${product.value.translated?.name} added to cart`);
};
