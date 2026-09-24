<!-- components/{{ componentName }}.vue -->
<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["{{ schemaType }}"];
}>();
</script>
