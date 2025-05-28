<script lang="ts" setup>
defineProps<{
  placeholder?: string;
}>();

const model = defineModel<string>({
  required: true,
});

const props = defineSlots<{
  leftIcon(): unknown;
  rightIcon(): unknown;
}>();
</script>
<template>


<!-- <div class="self-stretch h-10 px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#cac4d0] inline-flex flex-col justify-start items-start gap-2.5">
  <div data-show-dots="false" data-state="Placeholder" class="inline-flex justify-start items-center">
    <div class="justify-start text-[#686470] text-sm font-normal font-['Inter'] leading-[21px]">Input text</div>
  </div>
</div> -->
  <div class="flex items-center rounded-lg px-4 py-2 outline outline-1 outline-offset-[-1px] outline-outline-outline-variant text-surface-on-surface-variant">
    <slot name="leftIcon" />
    <input v-model="model" class="text-sm" type="text" :placeholder="placeholder"/>
    <slot name="rightIcon" />
  </div>
</template>
