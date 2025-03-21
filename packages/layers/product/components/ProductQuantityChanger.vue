<template>
  <div
    class="rounded outline outline-1 outline-offset-[-1px] outline-outline-outline inline-flex justify-start items-center overflow-hidden">
    <button class="w-10 h-10 bg-surface-surface flex justify-center items-center" @click="decrementQuantity"
      aria-label="Decrease quantity">
      <Minus class="h-4 w-4 text-surface-on-surface" />
    </button>
    <span
      class="h-10 px-4 bg-surface-surface text-surface-on-surface border-l border-r border-Outline-Outline inline-flex flex-col justify-center items-center">{{
      quantity }}</span>
    <button class="w-10 h-10 bg-surface-surface flex justify-center items-center" @click="incrementQuantity"
      aria-label="Increase quantity">
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