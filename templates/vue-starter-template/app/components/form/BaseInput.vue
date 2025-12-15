<script lang="ts" setup>
type InputTypeAttribute =
  | "email"
  | "number"
  | "password"
  | "tel"
  | "text"
  | "time"
  | "url";

const { placeholder, type = "text" } = defineProps<{
  placeholder?: string;
  type?: InputTypeAttribute;
  invalid?: boolean;
  autocomplete?: string;
}>();

const model = defineModel<string>({
  required: true,
});

const slots = defineSlots<{
  leftIcon(): unknown;
  rightIcon(): unknown;
}>();
</script>
<template>
  <div
    :class="{
      'outline-red': invalid,
    }"
    class="flex items-center rounded-lg px-4 pt-2 pb-2.5 border border-outline-outline-variant text-surface-on-surface-variant focus-within:outline-2 focus-within:outline-brand-primary focus-within:outline focus-within:outline-offset-[2px]"
  >
    <slot name="leftIcon" />
    <input
      v-model="model"
      class="text-sm w-full outline-none bg-transparent text-surface-on-surface placeholder:text-white placeholder:opacity-70"
      :placeholder="placeholder"
      :type="type"
      :autocomplete="autocomplete"
    />
    <slot name="rightIcon" />
  </div>
</template>
