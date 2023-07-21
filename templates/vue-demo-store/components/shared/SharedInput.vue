<script setup lang="ts">
const {
  modelValue,
  name,
  placeholder,
  label,
  labelRequired,
  disabled,
  errors
} = defineProps<{
  modelValue?: string;
  name?: string;
  placeholder?: string;
  label?: string;
  labelRequired?: boolean;
  disabled?: boolean;
  errors?: any[];
}>();

const attrs = useAttrs();
const emit = defineEmits(['update:modelValue']);

const onChange = (e: any) => {
  emit('update:modelValue', e.target.value);
}
</script>
<template>
  <div>
    <label
      v-if="label"
      class="text-sm font-medium text-gray-700 mb-1"
      :class="{
        'text-red-700': errors?.length
      }"
      :for="name"
    >
      {{ label }}
      <span v-if="labelRequired">*</span>
    </label>
    <input
      :id="name"
      :value="modelValue"
      @input="onChange"
      :name="name"
      type="text"
      :autocomplete="name"
      class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 shadow-sm focus:outline-none focus:ring-1 focus:z-10 sm:text-sm"
      :class="[
        errors?.length
          ? 'text-red-700 border-red-700 focus:ring-red-500'
          : 'border-gray-300 focus:ring-gray-700',
      ]"
      :placeholder="placeholder"
      :disabled="disabled"
      v-bind="attrs"
    />
    <span
      v-if="errors?.length"
      class="pt-1 text-xs text-red-700 focus:ring-brand-primary border-gray-300"
    >
      {{ errors?.[0]?.$message }}
    </span>
  </div>
</template>