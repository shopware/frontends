<script lang="ts" setup>
defineProps<{
  label: string;
}>();
</script>
<template>
  <button
    class="px-4 py-3 bg-brand-primary rounded inline-flex justify-center items-center gap-1"
  >
    <div
      class="justify-start text-white text-base font-bold font-['Inter'] leading-normal"
    >
      {{ label }}
    </div>
  </button>
</template>
