<script lang="ts" setup>
defineProps<{
  count: string;
}>();
</script>
<template>
  <div
    class="w-[18px] h-[18px] relative bg-[#d02d23] rounded-full overflow-hidden"
  >
    <div
      class="w-[18px] left-0 top-[-2px] absolute text-center justify-start text-white text-sm font-bold leading-[21px]"
    >
      {{ count }}
    </div>
  </div>
</template>
