<script
  setup
  lang="ts"
  generic="
    ListingFilter extends {
      code: string;
      label: string;
      name: string;
      entities?: Array<{
        id: string;
        name?: string;
        translated?: { name?: string };
      }>;
    }
  "
>
import { useCmsTranslations } from "@shopware/composables";
import { getTranslatedProperty } from "@shopware/helpers";
import { defu } from "defu";
import { computed, ref } from "vue";

import { useSessionContext } from "#imports";

const {
  filter,
  selectedFilters,
  displayMode = "accordion",
} = defineProps<{
  filter: ListingFilter;
  selectedFilters: {
    categories?: string[];
    [key: string]: unknown;
  };
  displayMode?: "accordion" | "dropdown";
}>();

const emits =
  defineEmits<
    (e: "select-value", value: { code: string; value: unknown }) => void
  >();

type Translations = {
  listing: {
    categories: string;
  };
};

let translations: Translations = {
  listing: {
    categories: "Categories",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const { sessionContext } = useSessionContext();

// The sales channel entry point is an ancestor of every product's category
// tree, so it would always show up with the full result count - hide it.
const categoryOptions = computed(() => {
  const rootCategoryId =
    sessionContext.value?.salesChannel?.navigationCategoryId;
  return (filter.entities ?? []).filter(
    (entity) => entity.id !== rootCategoryId,
  );
});

const isFilterVisible = ref<boolean>(false);
const toggle = () => {
  isFilterVisible.value = !isFilterVisible.value;
};

const selectedIds = computed(() => selectedFilters?.categories || []);

const isChecked = (id: string) => selectedIds.value.includes(id);

const selectValue = (id: string) => {
  emits("select-value", {
    code: filter.code,
    value: id,
  });
};
</script>

<template>
  <div
    v-if="categoryOptions.length"
    class="self-stretch flex flex-col justify-start items-start gap-4"
  >
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
          :aria-label="translations.listing.categories"
          @keydown.enter="toggle"
          @keydown.space.prevent="toggle"
        >
          <div class="flex-1 flex items-center gap-2.5">
            <div
              class="flex-1 text-surface-on-surface text-base font-bold leading-normal text-left"
            >
              {{ translations.listing.categories }}
            </div>
          </div>
          <span class="flex items-center justify-center" aria-hidden="true">
            <SwChevronIcon
              :direction="isFilterVisible ? 'up' : 'down'"
              :size="24"
            />
          </span>
        </div>
      </div>
    </template>

    <!-- Filter content -->
    <transition name="filter-collapse">
      <div
        v-if="isFilterVisible || displayMode === 'dropdown'"
        :id="filter.code"
        class="self-stretch flex flex-col justify-start items-start gap-4"
      >
        <fieldset
          class="self-stretch flex flex-col justify-start items-start gap-4"
        >
          <legend class="sr-only">{{ translations.listing.categories }}</legend>
          <label
            v-for="option in categoryOptions"
            :key="`${option.id}-${isChecked(option.id)}`"
            class="self-stretch inline-flex justify-start items-start gap-2 cursor-pointer"
          >
            <div
              class="w-4 self-stretch pt-[3px] flex justify-start items-start gap-2.5"
            >
              <SwCheckbox
                :model-value="isChecked(option.id)"
                @update:model-value="() => selectValue(option.id)"
              />
            </div>
            <div
              class="flex-1 inline-flex flex-col justify-start items-start gap-0.5"
            >
              <div class="inline-flex justify-start items-center gap-1">
                <div
                  class="flex-1 text-surface-on-surface text-base font-normal leading-normal"
                >
                  {{ getTranslatedProperty(option, "name") }}
                </div>
              </div>
            </div>
          </label>
        </fieldset>
      </div>
    </transition>
  </div>
</template>
