<script lang="ts" setup>
const { variant = "default" } = defineProps<{
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
  id: string;
  invalid?: boolean;
  loading?: boolean;
  autocomplete?: string;
  variant?: "default" | "control";
}>();

const model = defineModel<string>({
  required: true,
});

const rounded = computed(() =>
  variant === "control" ? "rounded-md" : "rounded-lg",
);

const fieldClass = computed(() =>
  variant === "control"
    ? "border border-outline-outline-variant bg-white text-surface-on-surface"
    : "text-surface-on-surface-variant",
);
</script>
<template>
  <div
    :class="rounded"
    class="focus-within:outline-2 focus-within:outline-outline-outline-focus focus-within:outline focus-within:outline-offset-[2px]"
  >
    <div
      :class="[rounded, fieldClass, { 'outline-states-error': invalid }]"
      class="relative flex items-center px-4 py-2 outline outline-1 outline-offset-[-1px] outline-outline-outline-variant"
    >
      <select
        class="w-full outline-none bg-transparent"
        :class="{ 'appearance-none pr-6': variant === 'control' }"
        v-model="model"
        :id="id"
        :disabled="loading"
        :autocomplete
      >
        <option v-if="loading" value="" selected disabled>
          {{ $t("form.loading") }}
        </option>
        <option v-else-if="placeholder" value="">{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <SwChevronIcon
        v-if="variant === 'control'"
        direction="down"
        :size="16"
        class="pointer-events-none absolute right-3"
      />
    </div>
  </div>
</template>
