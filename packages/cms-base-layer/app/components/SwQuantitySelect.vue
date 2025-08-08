<script setup lang="ts">
const quantity = defineModel<number>({
  required: true,
});

const {
  size = "large",
  steps,
  max,
  min,
} = defineProps<{
  size?: "small" | "large";
  steps?: number;
  min?: number;
  max?: number;
}>();

function increaseQty() {
  quantity.value++;
}

function decreaseQty() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

const sizeClasses = {
  small: "w-8 h-8",
  large: "w-10 h-10",
};
</script>
<template>
  <div class="rounded outline outline-1 outline-offset-[-1px] outline-outline-outline inline-flex">
    <button :class="sizeClasses[size]"
      class="bg-surface-surface border-0 border-r-1 cursor-pointer hover:bg-brand-tertiary-hover font-semibold"
      @click="decreaseQty">
      -
    </button>
    <div class="bg-white border-l border-r border-outline-outline inline-flex flex-col justify-center items-center">
      <input v-model="quantity" type="number" :min="min" :max="max" :step="steps" data-testid="product-quantity"
        :class="sizeClasses[size]"
        class="self-stretch text-center justify-start text-surface-on-surface text-xs font-bold leading-[18px] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
    </div>
    <button :class="sizeClasses[size]"
      class="w-10 bg-surface-surface border-0 border-l-1 cursor-pointer hover:bg-brand-tertiary-hover font-semibold"
      @click="increaseQty">
      +
    </button>
  </div>
</template>
