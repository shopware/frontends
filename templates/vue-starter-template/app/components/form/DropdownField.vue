<script lang="ts" setup>
defineProps<{
  placeholder?: string;
  label?: string;
  id: string;
  options: {
    label: string;
    value: string;
  }[];
  errorMessage?: string;
}>();

const model = defineModel<string>({
  required: true,
});
</script>
<template>
  <div>
    <label
      class="text-surface-on-surface text-sm mb-1 block"
      v-if="label"
      :for="id"
    >
      {{ label }}
    </label>

    <FormBaseDropdown
      class="text-sm w-full"
      v-model="model"
      :placeholder="placeholder"
      :id="id"
      :options="options"
      :invalid="!!errorMessage"
    />
    <span v-if="errorMessage" class="text-red text-xs absolute">{{
      errorMessage
    }}</span>
  </div>
</template>
