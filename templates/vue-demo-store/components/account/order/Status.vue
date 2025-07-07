<script lang="ts" setup>
import type { Schemas } from "#shopware";

const props = defineProps<{
  state: Schemas["StateMachineState"];
}>();

const statusClass = computed(() => {
  switch (props.state.technicalName) {
    case "completed":
      return "bg-states-success-container text-states-on-success-container";
    case "open":
    case "in_progress":
      return "bg-states-warning-container text-states-on-warning-container";
    case "cancelled":
      return "bg-states-error-container text-states-on-error-container";
    default:
      return "bg-surface-surface-disabled text-surface-on-surface-disabled";
  }
});
</script>
<template>
  <span
    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
    :class="statusClass"
    >{{ state.name }}</span
  >
</template>
