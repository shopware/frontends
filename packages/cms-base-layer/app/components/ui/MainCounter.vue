<script lang="ts" setup>
defineSlots<{
  default(): unknown;
}>();

defineProps<{
  count: number;
}>();
</script>
<template>
  <div
    class="w-[18px] h-[18px]  bg-states-error rounded-full overflow-hidden"
  >
    <div
      class="w-[18px] left-0 top-[-2px] absolute text-center justify-start text-white text-sm font-bold leading-[21px]"
    >
      <slot> {{ count }} </slot>
    </div>
  </div>
</template>
