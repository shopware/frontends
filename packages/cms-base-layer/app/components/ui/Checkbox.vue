<script setup lang="ts">
const model = defineModel<boolean>({
  required: true,
});

const {
  label,
  description,
  disabled = false,
} = defineProps<{
  label: string;
  description?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <label class="flex items-start gap-2">
    <input
      class="accent-brand-primary w-4 h-4 focus-within:outline-2 focus-within:outline-blue-500 focus-within:outline focus-within:outline-offset-[2px] focus-within"
      type="checkbox"
      v-model="model"
      :disabled
    />
    <div>
      <p
        :class="
          disabled
            ? 'text-surface-on-surface-disabled'
            : 'text-surface-on-surface'
        "
      >
        {{ label }}
      </p>
      <p
        v-if="description"
        class="text-sm"
        :class="
          disabled
            ? 'text-surface-on-surface-disabled'
            : 'text-surface-on-surface-variant'
        "
      >
        {{ description }}
      </p>
    </div>
  </label>
</template>
