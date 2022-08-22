<script setup lang="ts">
import { CmsElementForm } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsElementForm;
}>();
const FormComponent = computed(() => {
  switch (props.content.config.type.value) {
    case "contact":
      return defineAsyncComponent(() => import("../../SwContactForm.vue"));
    case "newsletter":
      return defineAsyncComponent(() => import("../../SwNewsletterForm.vue"));
    default:
      return defineAsyncComponent(() => import("../../SwContactForm.vue"));
  }
});
</script>
<template>
  <div class="cms-element-form">
    <component :content="content" :is="FormComponent" />
  </div>
</template>
