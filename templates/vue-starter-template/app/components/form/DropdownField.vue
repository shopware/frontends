<script lang="ts" setup>
import type { MaybeRef } from "vue";

const { errorMessage } = defineProps<{
  placeholder?: string;
  label?: string;
  id: string;
  options: {
    label: string;
    value: string;
  }[];
  errorMessage?: MaybeRef<string>;
  loading?: boolean;
}>();

const model = defineModel<string>();

const errorText = computed(() => unref(errorMessage));
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
      :invalid="!!errorText"
      :loading
    />
    <span v-if="errorText" class="text-red text-xs absolute">{{
      errorText
    }}</span>
  </div>
</template>
