<script setup lang="ts">
import { CmsElementForm } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsElementForm;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);

const FormComponent = computed(() => {
  switch (getConfigValue("type")) {
    case "newsletter":
      return defineAsyncComponent(
        () => import("../../SwNewsletterForm.vue")
      );
    case "contact":
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
