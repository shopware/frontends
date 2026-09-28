import { useCart } from "#imports";
import type { Schemas } from "#shopware";

const { removeItem } = useCart();

await removeItem({
  id: "7b5b97bd48454979b14f21c8ef38ce08",
} as Schemas["LineItem"]);
