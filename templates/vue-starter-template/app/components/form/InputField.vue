<script lang="ts" setup>
import type { MaybeRef } from "vue";

import type { FocusableInput } from "#imports";

defineOptions({ inheritAttrs: false });

const {
  placeholder,
  label = "",
  id = "",
  type = "text",
  errorMessage,
} = defineProps<{
  placeholder?: string;
  label?: string;
  id?: string;
  type?: "text" | "password" | "email";
  errorMessage?: MaybeRef<string>;
  autocomplete?: string;
}>();

const model = defineModel<string>({
  required: true,
});

const errorText = computed(() => unref(errorMessage));

const { wrapperAttrs, controlAttrs } = useControlAttrs();

const baseInput = useTemplateRef<FocusableInput>("baseInput");

defineExpose<FocusableInput>({
  focus: (options) => baseInput.value?.focus(options),
});
</script>
<template>
  <div v-bind="wrapperAttrs" class="relative">
    <label
      class="text-surface-on-surface text-sm mb-1 block"
      v-if="label"
      :for="id"
    >
      {{ label }}
    </label>

    <FormBaseInput
      ref="baseInput"
      class="text-sm w-full"
      v-model="model"
      :placeholder="placeholder"
      :type="type"
      :id="id"
      :invalid="!!errorText"
      :autocomplete="autocomplete"
      v-bind="controlAttrs"
    />
    <span v-if="errorText" class="text-states-error text-xs block mt-1">{{
      errorText
    }}</span>
  </div>
</template>
