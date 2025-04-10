import type { Schemas } from "@shopware/api-client/store-api-types";
import { computed } from "vue";

export function useCartItemComponent(
  item: ComputedRef<Schemas["LineItem"]>,
  emit: {
    (e: "quantity-change", itemId: string, quantity: number): void;
    (e: "remove", itemId: string): void;
  },
) {
  // Computed properties to extract data from the item
  const itemImage = computed(() => {
    return (
      item.value?.cover?.thumbnails?.find((thumb) => thumb.width === 280)
        ?.url ||
      item.value?.cover?.media?.url ||
      "https://placehold.co/280x280"
    );
  });

  const itemPrice = computed(() => {
    return item.value?.price?.unitPrice || 0;
  });

  const formattedPrice = computed(() => {
    const price = itemPrice.value;
    const currency = item.value?.price?.currency?.symbol || "€";
    return `${price.toFixed(2)} ${currency}`;
  });

  const characteristics = computed(() => {
    if (!item.value?.payload?.options?.length) return "";

    return item.value?.payload.options
      .map((option) => `${option.group}: ${option.option}`)
      .join(", ");
  });

  // Handlers
  const handleIncrement = () => {
    console.warn(
      "Incrementing item quantity",
      item.value?.id,
      item.value?.quantity,
    );
    emit("quantity-change", item.value?.id, item.value?.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.value?.quantity > 1) {
      emit("quantity-change", item.value?.id, item.value?.quantity - 1);
    }
  };

  const handleRemove = () => {
    emit("remove", item.value?.id);
  };

  return {
    itemImage,
    itemPrice,
    formattedPrice,
    characteristics,
    handleIncrement,
    handleDecrement,
    handleRemove,
  };
}
