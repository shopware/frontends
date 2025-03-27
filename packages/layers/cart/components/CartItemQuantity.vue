<script setup>
import { Minus, Plus } from "lucide-vue-next";

defineProps({
  quantity: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    default: "sm",
    validator: (value) => ["sm", "md"].includes(value),
  },
});

const emit = defineEmits(["increment", "decrement"]);

const handleIncrement = () => {
  emit("increment");
};

const handleDecrement = () => {
  emit("decrement");
};
</script>

<template>
  <div class="flex border border-outline-outline rounded-md overflow-hidden">
    <button
      :disabled="quantity === 1"
      @click="handleDecrement"
      :class="`${size === 'sm' ? 'w-8 h-8' : 'w-12 h-12'} ${quantity === 1 ? 'bg-surface-surface-disabled' : ''} flex items-center justify-center border-r border-outline-outline text-surface-on-surface bg-surface-surface`"
    >
      <Minus :size="size === 'sm' ? 16 : 20" />
    </button>
    <div 
      :class="`${size === 'sm' ? 'w-8 h-8' : 'w-12 h-12'} flex items-center justify-center border-r border-outline-outline text-surface-on-surface`"
    >
      {{ quantity }}
    </div>
    <button 
      @click="handleIncrement"
      :class="`${size === 'sm' ? 'w-8 h-8' : 'w-12 h-12'} flex items-center justify-center text-surface-on-surface bg-surface-surface`"
    >
      <Plus :size="size === 'sm' ? 16 : 20" />
    </button>
  </div>
</template>