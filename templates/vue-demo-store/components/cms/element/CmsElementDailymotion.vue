<script setup lang="ts">
import type { CmsSlot } from "@shopware-pwa/types";

type CmsElementDailymotion = CmsSlot & {
  type: "dailymotion" | typeof String;
  slot: typeof String;
  config: CmsElementDailymotionConfig;
  translated: {
    config: CmsElementDailymotionConfig;
  };
};

type CmsElementDailymotionConfig = {
  dailyUrl: {
    value: string;
    source: "static";
  };
};
const props = defineProps<{
  content: CmsElementDailymotion;
}>();
</script>

<template>
  <div>
    <h2>Element!</h2>
    <div class="sw-cms-el-dailymotion">
      <div class="sw-cms-el-dailymotion-iframe-wrapper">
        <iframe
          frameborder="0"
          type="text/html"
          width="100%"
          height="100%"
          :src="props.content.config.dailyUrl.value"
        >
        </iframe>
      </div>
    </div>
  </div>
</template>
