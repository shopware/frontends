<template>
  <div>
    <a :href="page">
      <div
        class="border-1px border-#eeeeee rounded-md p-4 shadow-md bg-#fdfdfd mb-6 hover:shadow-lg hover:border-#e8e8e8 dark:border-#444 dark:bg-#222 dark:hover:border-#333 dark:hover:bg-#212121"
      >
        {{ title }}
        <div
          v-if="sub.length > 0"
          class="mt-2 text-gray font-normal text-xs block"
        >
          {{ sub }}
        </div>
      </div>
    </a>
  </div>
</template>

<script>
import { useAttrs, ref } from "vue";

export default {
  setup() {
    let attrs = useAttrs();

    let title = ref(attrs.title);

    let page = ref(attrs.page);

    let sub = ref(attrs.sub || "");

    return {
      title,
      page,
      sub,
    };
  },
};
</script>
