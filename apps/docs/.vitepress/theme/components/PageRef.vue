<template>
  <div>
    <a :href="page" :target="target">
      <div
        class="flex gap-3 border-1px border-#eeeeee rounded-md p-4 shadow-md bg-#fdfdfd mb-6 hover:shadow-lg hover:border-#e8e8e8 dark:border-#444 dark:bg-#222 dark:hover:border-#333 dark:hover:bg-#212121"
      >
        <div v-if="icon" class="flex w-14 items-center">
          <img :src="icon" class="w-14 h-14 object-cover" />
        </div>
        <div class="flex-1">
          {{ title }}
          <div
            v-if="sub.length > 0"
            class="mt-2 text-gray font-normal text-xs block"
          >
            {{ sub }}
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
import { ref, useAttrs } from "vue";

export default {
  setup() {
    const attrs = useAttrs();

    const title = ref(attrs.title);

    const page = ref(attrs.page);

    const icon = ref(attrs.icon || "");

    const sub = ref(attrs.sub || "");

    const target = ref(attrs.target || "");

    return {
      title,
      page,
      sub,
      icon,
      target,
    };
  },
};
</script>
