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

const emit = defineEmits<{
  focus: [];
}>();
</script>
<template>
  <div
    class="focus-within:outline-2 focus-within:outline-outline-outline-focus focus-within:outline focus-within:outline-offset-[2px] rounded-lg"
  >
    <div
      :class="{
        'outline-states-error': invalid,
      }"
      class="flex items-center rounded-lg px-4 pt-2 pb-2.5 outline-outline-outline-variant outline outline-1 text-surface-on-surface-variant outline-offset-[-1px] input-field bg-surface-surface"
    >
      <slot name="leftIcon" />
      <input
        v-model="model"
        class="text-sm w-full outline-none bg-transparent text-surface-on-surface placeholder:text-surface-on-surface-variant"
        :placeholder="placeholder"
        :type="type"
        :autocomplete="autocomplete"
        @focus="emit('focus')"
      />
      <slot name="rightIcon" />
    </div>
  </div>
</template>
