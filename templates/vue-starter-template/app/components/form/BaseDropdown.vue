<script lang="ts" setup>
defineProps<{
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
  id: string;
  invalid?: boolean;
}>();

const model = defineModel<string>({
  required: true,
});
</script>
<template>
  <div
    class="focus-within:outline-2 focus-within:outline-blue-500 focus-within:outline focus-within:outline-offset-[2px] rounded-lg"
  >
    <div
      :class="{
        'outline-red': invalid,
      }"
      class="flex items-center rounded-lg px-4 py-2 outline outline-1 outline-offset-[-1px] outline-outline-outline-variant text-surface-on-surface-variant"
    >
      <select class="w-full outline-none" v-model="model" :id="id">
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
  </div>
</template>
