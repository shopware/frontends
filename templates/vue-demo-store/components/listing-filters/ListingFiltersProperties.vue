<script
  setup
  lang="ts"
  generic="
    ListingFilter extends {
      code: string;
      label: string;
      name: string;
      options: Array<Schemas['PropertyGroupOption']>;
      entities: Array<Schemas['ProductManufacturer']>;
    }
  "
>
import { inject, ref } from "vue";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import type { Schemas } from "#shopware";

const props = defineProps<{
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
  <div class="border-b border-secondary-200 py-6 px-5">
    <h3 class="-my-3 flow-root">
      <button
        type="button"
        class="flex w-full items-center justify-between bg-white py-2 text-base text-secondary-400 hover:text-secondary-500"
        @click="toggle"
      >
        <span class="font-medium text-secondary-900 text-left">{{
          props.filter.label
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
      <div v-show="isFilterVisible" :id="props.filter.code" class="pt-6">
        <fieldset class="space-y-4">
          <legend class="sr-only">{{ props.filter.name }}</legend>
          <div
            v-for="option in props.filter.options || props.filter.entities"
            :key="`${option.id}-${selectedOptionIds?.includes(option.id)}`"
            class="flex items-center"
          >
            <input
              :id="`filter-mobile-${props.filter.code}-${option.id}`"
              :checked="selectedOptionIds?.includes(option.id)"
              :name="props.filter.name"
              :value="option.name"
              :aria-label="`${option.name} filter`"
              type="checkbox"
              class="h-4 w-4 border-secondary-300 rounded text-indigo-600 focus:ring-indigo-500"
              @change="
                emits('select-value', {
                  code: props.filter.code,
                  value: option.id,
                })
              "
            />

            <div v-if="option.media?.url">
              <img
                loading="lazy"
                class="ml-2 h-4 w-4"
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
            <label
              :for="`filter-mobile-${props.filter.code}-${option.id}`"
              class="ml-3 text-secondary-600"
            >
              {{ getTranslatedProperty(option, "name") }}
            </label>
          </div>
        </fieldset>
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
