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

const textContent = computed<CmsElementText>(() => ({
  ...props.content,
  type: "text",
  data: {
    apiAlias: "cms_text",
    content: getCategoryNameContent(props.content),
  },
}));
</script>
<template>
  <CmsElementText :content="textContent" class="cms-element-category-name" />
</template>
