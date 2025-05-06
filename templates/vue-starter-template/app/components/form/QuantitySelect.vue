<script setup lang="ts">
const qty = defineModel<number>({
  required: true,
});

const { size = "large" } = defineProps<{
  size?: "small" | "large";
}>();

function increaseQty() {
  qty.value++;
}

function decreaseQty() {
  if (qty.value > 1) {
    qty.value--;
  }
}

const sizeClasses = {
  small: "w-8 h-8",
  large: "w-10 h-10",
};
</script>
<template>
  <div
    class="h-10 rounded outline outline-1 outline-offset-[-1px] outline-outline-outline inline-flex"
  >
    <button class="w-10 bg-surface-surface border-0 border-r-1 cursor-pointer hover:bg-brand-tertiary-hover font-semibold" @click="decreaseQty">-</button>
    <div
      class="bg-white border-l border-r border-outline-outline inline-flex flex-col justify-center items-center"
    >
      <div
        class="w-10 self-stretch text-center justify-start text-[#1d1b20] text-xs font-bold  leading-[18px]"
      >
        {{ qty }}
      </div>
    </div>
    <button class="w-10 bg-surface-surface border-0 border-l-1 cursor-pointer hover:bg-brand-tertiary-hover font-semibold" @click="increaseQty">+</button>
  </div>
</template>