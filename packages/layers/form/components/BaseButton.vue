<script lang="ts" setup>
defineProps<{
  label: string;
  disabled: boolean;
}>();
</script>
<template>
<button class="px-4 py-3 bg-[#543b94] rounded inline-flex justify-center items-center gap-1">
  <div class="justify-start text-white text-base font-bold font-['Inter'] leading-normal">{{ label }}</div>
</button>
</template>
