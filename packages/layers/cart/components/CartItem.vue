<script setup lang="ts">
import type { Schemas } from "@shopware/api-client/store-api-types";
import { computed } from "vue";

// Define props to accept the whole line item object
const props = defineProps<{
  item: Schemas["LineItem"];
}>();

// Define events
const emit = defineEmits<{
  "quantity-change": [itemId: string, quantity: number];
  remove: [itemId: string];
}>();

// Computed properties to extract data from the item
const itemImage = computed(() => {
  return (
    props.item.cover?.thumbnails?.find((thumb) => thumb.width === 280)?.url ||
    props.item.cover?.media?.url ||
    "https://placehold.co/280x280"
  );
});

const itemPrice = computed(() => {
  return props.item.price?.unitPrice || 0;
});

const formattedPrice = computed(() => {
  const price = itemPrice.value;
  const currency = props.item.price?.currency?.symbol || "€";
  return `${price.toFixed(2)} ${currency}`;
});

const characteristics = computed(() => {
  if (!props.item.payload?.options?.length) return "";

  return props.item.payload.options
    .map((option) => `${option.group}: ${option.option}`)
    .join(", ");
});

// Handlers
const handleIncrement = () => {
  emit("quantity-change", props.item.id, props.item.quantity + 1);
};

const handleDecrement = () => {
  if (props.item.quantity > 1) {
    emit("quantity-change", props.item.id, props.item.quantity - 1);
  }
};

const handleRemove = () => {
  emit("remove", props.item.id);
};
</script>

<template>
  <div class="py-6 flex gap-4 w-full">
    <div class="bg-surface-surface-variant w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
      <img 
        :src="itemImage" 
        :alt="item.label" 
        class="w-full h-full object-contain"
      />
    </div>
    
    <div class="flex-1 flex flex-col">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-medium text-surface-on-surface">{{ item.label }}</h3>
          <p v-if="characteristics" class="text-scale-01 text-outline-outline">{{ characteristics }}</p>
        </div>
        <span class="font-medium text-surface-on-surface">{{ formattedPrice }}</span>
      </div>
      
      <div class="flex justify-between items-center mt-auto pt-2">
        <CartItemQuantity 
          :quantity="item.quantity" 
          @increment="handleIncrement" 
          @decrement="handleDecrement" 
        />
        
        <button 
          @click="handleRemove" 
          class="text-brand-primary text-scale-02 font-medium border-b border-brand-primary bg-transparent hover:border-b-0"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>