const { changeProductQuantity } = useCart();

const cartItem: LineItem = {
  id: "7b5b97bd48454979b14f21c8ef38ce08",
  quantity: 2,
};

changeProductQuantity(cartItem);
