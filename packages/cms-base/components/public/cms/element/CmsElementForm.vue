<script setup lang="ts">
import type { CmsElementForm } from "@shopware-pwa/composables-next";
import { useCmsElementConfig } from "#imports";
import { computed, defineAsyncComponent } from "vue";

const props = defineProps<{
  content: CmsElementForm;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);

const FormComponent = computed(() => {
  switch (getConfigValue("type")) {
    case "newsletter":
      return defineAsyncComponent(
        () => import("../../../SwNewsletterForm.vue"),
      );
    case "contact":
    default:
      return defineAsyncComponent(() => import("../../../SwContactForm.vue"));
  }
});
</script>
<template>
  <div class="cms-element-form">
    <component :is="FormComponent" :content="content" />
  </div>
</template>
