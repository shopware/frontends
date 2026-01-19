<script
  setup
  lang="ts"
  generic="
    ListingFilter extends {
      id: string;
      code: keyof Schemas['ProductListingResult']['currentFilters'];
      label: string;
      name: string;
    }
  "
>
import { useCmsTranslations } from "@shopware/composables";
import { onClickOutside } from "@vueuse/core";
import { defu } from "defu";
import { computed, ref } from "vue";
import type { Schemas } from "#shopware";

const {
  filter,
  selectedFilters,
  description,
  displayMode = "accordion",
} = defineProps<{
  filter: ListingFilter;
  selectedFilters: Schemas["ProductListingResult"]["currentFilters"];
  description?: string; // Optional description for i18n
  displayMode?: "accordion" | "dropdown";
}>();

type Translations = {
  listing: {
    freeShipping: string;
  };
};
let translations: Translations = {
  listing: {
    freeShipping: "Free shipping",
  },
};
translations = defu(useCmsTranslations(), translations) as Translations;

const emits =
  defineEmits<
    (e: "select-value", value: { code: string; value: unknown }) => void
  >();
const currentFilterData = computed(() => !!selectedFilters[filter?.code]);

const isFilterVisible = ref<boolean>(false);
const toggle = () => {
  isFilterVisible.value = !isFilterVisible.value;
};

const dropdownElement = ref(null);
onClickOutside(dropdownElement, () => {
  isFilterVisible.value = false;
});

const handleRadioUpdate = (val: string | null | boolean | undefined) => {
  emits("select-value", { code: filter.code, value: !!val });
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
          :aria-controls="`filter-${filter.code}`"
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
      <div v-if="isFilterVisible || displayMode === 'dropdown'" class="self-stretch">
        <div class="pt-6 space-y-4">
          <div class="self-stretch inline-flex justify-start items-start gap-2 w-full">
            <div class="flex-1 pt-[3px]">
              <SwSwitchButton
                :model-value="currentFilterData"
                @update:model-value="handleRadioUpdate"
                :name="filter.code"
                :aria-label="filter.label"
                :label="filter.label"
                :description="description || translations.listing.freeShipping"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
