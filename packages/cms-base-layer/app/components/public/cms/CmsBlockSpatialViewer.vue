<script lang="ts" setup>
import { computed, defineAsyncComponent } from "vue";
import { useCmsBlock } from "#imports";
import type { Schemas } from "#shopware";

const SwMedia3DAsync = defineAsyncComponent(
  () => import("../../SwMedia3D.vue"),
);

const props = defineProps<{
  content: Schemas["CmsBlock"];
}>();

const { getSlotContent } = useCmsBlock(props.content);
const slotContent = getSlotContent("default");

function getConfigValue(key: string): unknown {
  if (!slotContent?.config) return null;
  const configEntry =
    slotContent.config[key as keyof typeof slotContent.config];
  if (
    configEntry &&
    typeof configEntry === "object" &&
    "value" in configEntry &&
    configEntry !== null
  ) {
    return (configEntry as { value: unknown }).value;
  }
  return null;
}

const modelUrl = computed(() => {
  if (slotContent?.data) {
    const data = slotContent.data as unknown as Schemas["Media"];
    if (data?.url && typeof data.url === "string") {
      return data.url;
    }
  }

  const configUrl = getConfigValue("url");
  if (typeof configUrl === "string" && configUrl) {
    return configUrl;
  }
  return null;
});

const maxHeight = computed(() => {
  const height = getConfigValue("maxHeight");
  return typeof height === "string" ? height : "600px";
});

const formFactor = computed(() => {
  const factor = getConfigValue("formFactor");
  return typeof factor === "string" ? factor : "square";
});

const aspectRatio = computed(() => {
  switch (formFactor.value) {
    case "square":
      return 1;
    case "landscape":
      return 16 / 9;
    case "portrait":
      return 9 / 16;
    default:
      return 1;
  }
});

const containerStyle = computed(() => ({
  width: "100%",
  height: "100%",
  minHeight: "400px",
  maxHeight: maxHeight.value,
  aspectRatio: `${aspectRatio.value}`,
  position: "relative" as const,
}));
</script>

<template>
  <div class="cms-block-spatial-viewer" :style="containerStyle">
    <client-only>
      <div v-if="modelUrl" class="w-full h-full">
        <SwMedia3DAsync :src="modelUrl" />
      </div>

      <template #fallback>
        <div class="w-full h-full flex items-center justify-center bg-gray-100">
          <span class="text-gray-500">3D Viewer</span>
        </div>
      </template>
    </client-only>
  </div>
</template>
