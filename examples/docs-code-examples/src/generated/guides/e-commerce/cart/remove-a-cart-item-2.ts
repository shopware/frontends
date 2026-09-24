import { toRefs, useCartItem } from "#imports";

const { cartItem } = toRefs(props);
const { removeItem } = useCartItem(cartItem);

await removeItem();
