<script setup lang="ts">
defineOptions({
  name: "CheckoutOrderMethodCard",
});

defineProps<{
  label: string;
  title?: string;
  description?: string;
}>();
</script>
<template>
  <div>
    <h3 class="text-surface-on-surface font-bold leading-normal mb-3">
      {{ label }}
    </h3>
    <div class="p-4 border border-outline-outline min-h-18">
      <div class="text-surface-on-surface text-base leading-normal">
        {{ title }}
      </div>
      <div
        v-if="description"
        class="text-surface-on-surface-variant text-sm leading-[21px] mt-0.5"
      >
        {{ description }}
      </div>
    </div>
  </div>
</template>
