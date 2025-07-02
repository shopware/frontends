<script lang="ts" setup>
defineProps<{
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
  id: string;
}>();

const model = defineModel<string>({
  required: true,
});
</script>
<template>
  <div
    class="flex items-center rounded-lg px-4 py-2 outline outline-1 outline-offset-[-1px] outline-outline-outline-variant text-surface-on-surface-variant"
  >
    <select class="w-full" v-model="model" :id="id">
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
