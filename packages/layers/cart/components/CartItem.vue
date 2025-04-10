<script setup lang="ts">
import type { Schemas } from "@shopware/api-client/store-api-types";
// import { useCartItemComponent } from "../composables/useCartItemComponent";

// Define props to accept the whole line item object
const props = defineProps<{
  item: Schemas["LineItem"];
}>();

// Define events
const emit = defineEmits<{
  "quantity-change": [itemId: string, quantity: number];
  remove: [itemId: string];
}>();

// Use the composable to get all the cart item functionality
const {
  itemImage,
  formattedPrice,
  characteristics,
  handleIncrement,
  handleDecrement,
  handleRemove,
} = useCartItemComponent(
  computed(() => props.item),
  emit,
);
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