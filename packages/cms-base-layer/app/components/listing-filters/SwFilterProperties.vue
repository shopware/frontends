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
import { getTranslatedProperty } from "@shopware/helpers";
import { computed, ref } from "vue";
import type { Schemas } from "#shopware";

const {
  filter,
  selectedFilters,
  displayMode = "accordion",
} = defineProps<{
  filter: ListingFilter;
  selectedFilters: {
    manufacturer?: string[];
    properties?: string[];
    [key: string]: unknown;
  };
  displayMode?: "accordion" | "dropdown";
}>();

const emits =
  defineEmits<
    (e: "select-value", value: { code: string; value: unknown }) => void
  >();

const isFilterVisible = ref<boolean>(false);
const toggle = () => {
  isFilterVisible.value = !isFilterVisible.value;
};

const selectedIds = computed(() => {
  if (filter.code === "manufacturer") {
    return selectedFilters?.manufacturer || [];
  }
  return selectedFilters?.properties || [];
});

const isChecked = (id: string) => selectedIds.value.includes(id);

const selectValue = (id: string) => {
  const emitCode =
    filter.code === "manufacturer" ? "manufacturer" : "properties";
  emits("select-value", {
    code: emitCode,
    value: id,
  });
};
</script>

<template>
  <div class="self-stretch flex flex-col justify-start items-start gap-4">
    <!-- Accordion header (only in accordion mode) -->
    <template v-if="displayMode === 'accordion'">
      <div class="self-stretch flex flex-col justify-center items-center">
        <div
          class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-between items-center gap-1 cursor-pointer"
          @click="toggle"
          role="button"
          tabindex="0"
          :aria-expanded="isFilterVisible"
          :aria-controls="filter.code"
          :aria-label="filter.label"
          @keydown.enter="toggle"
          @keydown.space.prevent="toggle"
        >
          <div class="flex-1 flex items-center gap-2.5">
            <div class="flex-1 text-surface-on-surface text-base font-bold leading-normal text-left">
              {{ filter.label }}
            </div>
          </div>
          <SwIconButton
            type="ghost"
            :aria-label="isFilterVisible ? 'Collapse filter' : 'Expand filter'"
            tabindex="-1"
          >
            <SwChevronIcon :direction="isFilterVisible ? 'up' : 'down'" :size="24" />
          </SwIconButton>
        </div>
      </div>
    </template>

    <!-- Filter content -->
    <transition name="filter-collapse">
      <div v-if="isFilterVisible || displayMode === 'dropdown'" :id="filter.code" class="self-stretch flex flex-col justify-start items-start gap-4">
        <fieldset class="self-stretch flex flex-col justify-start items-start gap-4">
        <legend class="sr-only">{{ filter.name }}</legend>
        <label
          v-for="option in filter.options || filter.entities"
          :key="`${option.id}-${isChecked(option.id)}`"
          class="self-stretch inline-flex justify-start items-start gap-2 cursor-pointer"
          @click="selectValue(option.id)"
        >
          <div class="w-4 self-stretch pt-[3px] flex justify-start items-start gap-2.5">
            <SwCheckbox
              :model-value="isChecked(option.id)"
              @update:model-value="() => selectValue(option.id)"
              @click.stop
            />
          </div>
          <div class="flex-1 inline-flex flex-col justify-start items-start gap-0.5">
            <div class="inline-flex justify-start items-center gap-1">
              <div class="flex-1 text-surface-on-surface text-base font-normal leading-normal">
                {{ getTranslatedProperty(option, 'name') }}
              </div>
            </div>
          </div>
        </label>
        </fieldset>
      </div>
    </transition>
  </div>
</template>
