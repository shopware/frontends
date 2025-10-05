<script lang="ts" setup>
const {
  placeholder,
  label = "",
  id,
  type = "text",
} = defineProps<{
  placeholder?: string;
  label?: string;
  id: string;
  type?: "text" | "password";
  errorMessage?: string;
  autocomplete?: string;
}>();

const model = defineModel<string>({
  required: true,
});
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
      :invalid="!!errorMessage"
      :autocomplete="autocomplete"
    />
    <span v-if="errorMessage" class="text-states-error text-xs absolute">{{
      errorMessage
    }}</span>
  </div>
</template>
