<template>
  <div class="flex items-center border border-outline-outline-variant rounded w-fit">
    <button 
      class="px-3 py-2 border-r border-outline-outline-variant"
      @click="decrementQuantity"
      aria-label="Decrease quantity"
    >
      <Minus class="h-4 w-4 text-surface-on-surface" />
    </button>
    <span class="px-4 py-2 min-w-[40px] text-center">{{ quantity }}</span>
    <button 
      class="px-3 py-2 border-l border-outline-outline-variant"
      @click="incrementQuantity"
      aria-label="Increase quantity"
    >
      <Plus class="h-4 w-4 text-surface-on-surface" />
    </button>
  </div>
</template>

<script setup>
import { Minus, Plus } from "lucide-vue-next";

const props = defineProps({
  quantity: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:quantity"]);

// Methods
const incrementQuantity = () => {
  emit("update:quantity", props.quantity + 1);
};

const decrementQuantity = () => {
  if (props.quantity > 1) {
    emit("update:quantity", props.quantity - 1);
  }
};
</script>