<script setup lang="ts">
import type {
  CmsElementCategoryName,
  CmsElementText,
} from "@shopware/composables";
import { computed } from "vue";

import { getCategoryNameContent } from "../../../../helpers/cms/getCategoryNameContent";

const props = defineProps<{
  content: CmsElementCategoryName;
}>();

const textContent = computed(
  () =>
    ({
      ...props.content,
      type: "text",
      config: {
        ...props.content.config,
        verticalAlign: {
          source: "static",
          value: props.content.config?.verticalAlign?.value ?? "",
        },
      },
      data: {
        apiAlias: "cms_text",
        content: getCategoryNameContent(props.content),
      },
    }) as CmsElementText,
);
</script>
<template>
  <CmsElementText :content="textContent" class="cms-element-category-name" />
</template>
