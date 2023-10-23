<script setup lang="ts">
import type { ListingFilter } from "@shopware-pwa/types";
import { inject, ref } from "vue";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";

defineProps<{
  filter: ListingFilter;
}>();

const emits = defineEmits<{
  (e: "select-value", value: { code: string; value: unknown }): void;
}>();
const selectedOptionIds = inject<string[]>("selectedOptionIds");
const isFilterVisible = ref<boolean>(false);
const toggle = () => {
  isFilterVisible.value = !isFilterVisible.value;
};
</script>

<template>
  <div class="border-b border-gray-200 py-6 px-5">
    <h3 class="-my-3 flow-root">
      <button
        type="button"
        class="flex w-full items-center justify-between bg-white py-2 text-base text-gray-400 hover:text-gray-500"
        @click="toggle"
      >
        <span class="font-medium text-gray-900 text-left">{{
          filter.label
        }}</span>
        <span class="ml-6 flex items-center">
          <i
            :class="[
              !isFilterVisible
                ? 'i-carbon-chevron-down'
                : 'i-carbon-chevron-up',
            ]"
          />
        </span>
      </button>
    </h3>
    <transition name="fade" mode="out-in">
      <div v-show="isFilterVisible" id="filter-section-0" class="pt-6">
        <div class="space-y-4">
          <div
            v-for="option in filter.options || filter.entities"
            :key="`${option.id}-${selectedOptionIds?.includes(option.id)}`"
            class="flex items-center"
            @click="
              emits('select-value', { code: filter.code, value: option.id })
            "
          >
            <input
              :id="`filter-mobile-${filter.code}-${option.id}`"
              :checked="selectedOptionIds?.includes(option.id)"
              :name="filter.name"
              :value="option.name"
              type="checkbox"
              class="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
            />

            <div v-if="option.media?.url">
              <img
                class="ml-2 h-4 w-4"
                loading="lazy"
                :src="option.media.url"
                :alt="option.media.translated?.alt || ''"
                :class="{
                  'border-blue border-2': selectedOptionIds?.includes(
                    option.id,
                  ),
                }"
              />
            </div>
            <div
              v-else-if="option.colorHexCode"
              class="ml-2 h-4 w-4"
              :style="`background-color: ${option.colorHexCode}`"
              :class="{
                'border-blue border-2': selectedOptionIds?.includes(option.id),
              }"
            />
            <label for="filter-color-0" class="ml-3 text-gray-600">
              {{ getTranslatedProperty(option, "name") }}
            </label>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
