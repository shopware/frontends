const { cartItem } = toRefs(props);
const { removeItem } = useCartItem(cartItem);

await removeItem();
