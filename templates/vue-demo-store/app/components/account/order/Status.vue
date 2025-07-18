<script lang="ts" setup>
import type { Schemas } from "#shopware";

const props = defineProps<{
  state: Schemas["StateMachineState"];
}>();

const statusClass = computed(() => {
  switch (props.state.technicalName) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "open":
    case "in_progress":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
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
