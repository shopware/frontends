<script lang="ts" setup>
defineProps<{
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
  id: string;
  invalid?: boolean;
  loading?: boolean;
  autocomplete?: string;
}>();

const model = defineModel<string>({
  required: true,
});
</script>
<template>
  <div
    class="focus-within:outline-2 focus-within:outline-outline-outline-focus focus-within:outline focus-within:outline-offset-[2px] rounded-lg"
  >
    <div
      :class="{
        'outline-states-error': invalid,
      }"
      class="flex items-center rounded-lg px-4 pt-2 pb-2.5 outline outline-1 outline-offset-[-1px] outline-outline-outline-variant text-surface-on-surface-variant"
    >
      <select
        class="text-sm leading-5 w-full appearance-none outline-none bg-transparent"
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
      <span
        class="i-carbon-chevron-down h-4 w-4 flex-none text-surface-on-surface-variant"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
