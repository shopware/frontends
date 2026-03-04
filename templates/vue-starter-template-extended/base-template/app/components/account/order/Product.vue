<script setup lang="ts">
import { getSmallestThumbnailUrl } from "@shopware/helpers";
import type { Schemas } from "#shopware";

const ELEMENT_WIDTH = 100;
const ELEMENT_HEIGHT = 100;

const { lineItem } = defineProps<{
  lineItem: Schemas["OrderLineItem"];
}>();
</script>

<template>
  <div class="flex gap-4 p-4">
    <div class="overflow-hidden">
      <NuxtImg
        :src="getSmallestThumbnailUrl(lineItem.cover)"
        :alt="`${lineItem.label} item`"
        fit="inside"
        class="object-cover"
        :style="`height: ${ELEMENT_HEIGHT}px; width: ${ELEMENT_WIDTH}px;`"
      />
    </div>

    <div class="flex-1 flex flex-col justify-between">
      <div>
        <h3 class="text-surface-on-surface mb-2">
          {{ lineItem.label }}
        </h3>
      </div>

      <div class="mt-auto">
        <SharedPrice
          v-if="lineItem.unitPrice"
          :value="lineItem.unitPrice"
          class="text-surface-on-surface"
        />
      </div>
    </div>
  </div>
</template>
