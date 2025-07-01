<script lang="ts" setup>
defineProps<{
  placeholder?: string;
  label?: string;
  id: string;
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

    <FormBaseInput
      class="text-sm w-full"
      v-model="model"
      :placeholder="placeholder"
      :id="id"
    />
  </div>
</template>
