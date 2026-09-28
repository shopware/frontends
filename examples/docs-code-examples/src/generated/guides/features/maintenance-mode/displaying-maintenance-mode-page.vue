// error.vue
<script setup lang="ts">
import { computed } from "#imports";
const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage: string;
    message: string;
  };
}>();

const isMaintenanceMode = computed(() => {
  return props.error.statusMessage === "MAINTENANCE_MODE";
});
</script>

<template>
  <div v-if="isMaintenanceMode">Maintenance Mode Page Content</div>
</template>
