<script setup lang="ts">
import type { CmsElementForm } from "@shopware/composables";
import { computed, defineAsyncComponent } from "vue";
import { useCmsElementConfig } from "#imports";

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
