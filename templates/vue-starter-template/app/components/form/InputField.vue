<script lang="ts" setup>
import type { MaybeRef } from "vue";

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
</script>
<template>
  <div class="relative">
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
    />
    <span v-if="errorText" class="text-states-error text-xs absolute">{{
      errorText
    }}</span>
  </div>
</template>
