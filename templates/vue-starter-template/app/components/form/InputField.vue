<script lang="ts" setup>
import type { MaybeRef } from "vue";

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

const errorId = `${id || useId()}-error`;
const describedBy = computed(() => (errorText.value ? errorId : undefined));

const { wrapperAttrs, controlAttrs } = useControlAttrs();
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
      class="text-sm w-full"
      v-model="model"
      :placeholder="placeholder"
      :type="type"
      :id="id"
      :invalid="!!errorText"
      :autocomplete="autocomplete"
      :aria-invalid="errorText ? true : undefined"
      :aria-describedby="describedBy"
      v-bind="controlAttrs"
    />
    <span
      v-if="errorText"
      :id="errorId"
      class="text-states-error text-xs block mt-1"
      >{{ errorText }}</span
    >
  </div>
</template>
