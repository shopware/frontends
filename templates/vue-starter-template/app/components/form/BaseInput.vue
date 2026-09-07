<script lang="ts" setup>
import type { FocusableInput } from "#imports";

type InputTypeAttribute =
  | "email"
  | "number"
  | "password"
  | "tel"
  | "text"
  | "time"
  | "url";

defineOptions({ inheritAttrs: false });

const {
  placeholder,
  type = "text",
  id = "",
} = defineProps<{
  placeholder?: string;
  type?: InputTypeAttribute;
  invalid?: boolean;
  autocomplete?: string;
  id?: string;
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

const { wrapperAttrs, controlAttrs } = useControlAttrs();

const inputElement = useTemplateRef<HTMLInputElement>("inputElement");

defineExpose<FocusableInput>({
  focus: (options) => inputElement.value?.focus(options),
});
</script>
<template>
  <div
    v-bind="wrapperAttrs"
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
        ref="inputElement"
        :id="id"
        v-model="model"
        class="text-sm w-full outline-none bg-transparent text-surface-on-surface placeholder:text-surface-on-surface-variant"
        :placeholder="placeholder"
        :type="type"
        :autocomplete="autocomplete"
        v-bind="controlAttrs"
        @focus="emit('focus')"
      />
      <slot name="rightIcon" />
    </div>
  </div>
</template>
