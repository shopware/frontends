<template>
  <div class="flex space-x-2">
    <button
      v-for="variant in variants"
      :key="variant.id"
      class="w-6 h-6 rounded-full"
      :class="{ 'ring-2 ring-offset-2 ring-surface-on-surface': isSelected(variant) }"
      :style="{ backgroundColor: variant.value }"
      @click="selectVariant(variant)"
      :aria-label="`Select ${variant.name}`"
    ></button>
  </div>
</template>

<script setup>
const props = defineProps({
  variants: {
    type: Array,
    required: true,
  },
  selectedVariant: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["select"]);

// Methods
const isSelected = (variant) => {
  return variant.id === props.selectedVariant.id;
};

const selectVariant = (variant) => {
  emit("select", variant);
};
</script>