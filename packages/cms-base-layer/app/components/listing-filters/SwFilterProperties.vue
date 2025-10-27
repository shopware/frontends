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

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: {
    manufacturer?: string[];
    properties?: string[];
    [key: string]: unknown;
  };
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
  if (props.filter.code === "manufacturer") {
    return props.selectedFilters?.manufacturer || [];
  }
  return props.selectedFilters?.properties || [];
});

const isChecked = (id: string) => selectedIds.value.includes(id);

const selectValue = (id: string) => {
  const emitCode =
    props.filter.code === "manufacturer" ? "manufacturer" : "properties";
  emits("select-value", {
    code: emitCode,
    value: id,
  });
};
</script>

<template>
  <div class="self-stretch flex flex-col justify-start items-start gap-4">
    <div class="self-stretch flex flex-col justify-center items-center">
      <div 
        class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-between items-center gap-1 cursor-pointer"
        @click="toggle"
        role="button"
        tabindex="0"
        :aria-expanded="isFilterVisible"
        :aria-controls="props.filter.code"
        @keydown.enter="toggle"
        @keydown.space.prevent="toggle"
      >
        <div class="flex-1 flex items-center gap-2.5">
          <div class="flex-1 text-surface-on-surface text-base font-bold leading-normal text-left">
            {{ props.filter.label }}
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
    <transition name="filter-collapse">
      <div v-if="isFilterVisible" :id="props.filter.code" class="self-stretch flex flex-col justify-start items-start gap-4">
        <fieldset class="self-stretch flex flex-col justify-start items-start gap-4">
        <legend class="sr-only">{{ props.filter.name }}</legend>
        <label
          v-for="option in props.filter.options || props.filter.entities"
          :key="`${option.id}-${isChecked(option.id)}`"
          class="self-stretch inline-flex justify-start items-start gap-2 cursor-pointer"
          @click="selectValue(option.id)"
        >
          <div class="w-4 self-stretch pt-[3px] flex justify-start items-start gap-2.5">
            <SwCheckbox
              :label="''"
              :description="undefined"
              :disabled="false"
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
