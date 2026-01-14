<script setup lang="ts">
import { defu } from "defu";
import { computed, useId } from "vue";
import { useCmsTranslations } from "#imports";

type Translations = {
  form: {
    quantitySelect: {
      label: string;
      increaseButton: string;
      decreaseButton: string;
    };
  };
};

let translations = {
  form: {
    quantitySelect: {
      label: "Quantity",
      increaseButton: "Increase quantity",
      decreaseButton: "Decrease quantity",
    },
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const quantity = defineModel<number>({
  required: true,
});

const {
  size = "large",
  steps,
  max,
  min,
  id: propId,
} = defineProps<{
  size?: "small" | "large";
  steps?: number;
  min?: number;
  max?: number;
  id?: string;
}>();

// generate an id that prefers a provided prop and otherwise uses Vue's useId for SSR/CSR consistency
const generatedId = useId();
const inputId = computed(() => propId || generatedId);

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
    <button
      type="button"
      :class="sizeClasses[size]"
      class="bg-surface-surface border-0 border-r-1 cursor-pointer hover:bg-brand-tertiary-hover font-semibold"
      @click="decreaseQty"
      :aria-label="translations.form.quantitySelect.decreaseButton"
    >
      -
    </button>
    <div class="bg-white border-l border-r border-outline-outline inline-flex flex-col justify-center items-center">
      <!-- visually hidden label for screen readers -->
      <label :for="inputId" class="sr-only">{{ translations.form.quantitySelect.label }}</label>

      <input
        :id="inputId"
        v-model="quantity"
        type="number"
        :min="min"
        :max="max"
        :step="steps"
        data-testid="product-quantity"
        :class="sizeClasses[size]"
        class="self-stretch text-center justify-start text-surface-on-surface text-xs font-bold leading-[18px] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        :aria-label="translations.form.quantitySelect.label"
      />
    </div>
    <button
      type="button"
      :class="sizeClasses[size]"
      class="w-10 bg-surface-surface border-0 border-l-1 cursor-pointer hover:bg-brand-tertiary-hover font-semibold"
      @click="increaseQty"
      :aria-label="translations.form.quantitySelect.increaseButton"
    >
      +
    </button>
  </div>
</template>
