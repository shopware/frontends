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
import ChevronDownIcon from "@cms-assets/chevron-down-xs.svg";
import ChevronUpIcon from "@cms-assets/chevron-up-xs.svg";
import { getTranslatedProperty } from "@shopware/helpers";
import { computed, inject, ref } from "vue";
import type { Ref } from "vue";
import type { Schemas } from "#shopware";

const props = defineProps<{
  filter: ListingFilter;
}>();

const emits =
  defineEmits<
    (e: "select-value", value: { code: string; value: unknown }) => void
  >();
// selectedOptionIds can be a computed ref provided by the parent or a plain array fallback
const selectedOptionIds = inject<Ref<string[]>>("selectedOptionIds", ref([]));
const isFilterVisible = ref<boolean>(false);
const toggle = () => {
  isFilterVisible.value = !isFilterVisible.value;
};

const getChecked = (id: string) =>
  computed<boolean>({
    get: () => {
      return !!selectedOptionIds?.value?.includes?.(id);
    },
    set: () => {
      emits("select-value", {
        code: props.filter.code,
        value: id,
      });
    },
  });
</script>

<template>
  <div class="self-stretch flex flex-col justify-start items-start gap-4">
    <div data-icon="true" data-level="1" data-state="Default" class="self-stretch flex flex-col justify-center items-center">
      <button @click="toggle" class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1 bg-transparent w-full cursor-pointer focus:outline-none">
        <div class="flex-1 flex justify-start items-center gap-2.5">
          <div class="flex-1 justify-start text-surface-on-surface text-base font-bold font-['Inter'] leading-normal text-left">
            {{ props.filter.label }}
          </div>
        </div>
        <SwIconButton type="ghost" @click.stop="toggle" :aria-label="isFilterVisible ? 'Collapse filter' : 'Expand filter'">
          <img v-if="!isFilterVisible" :src="ChevronDownIcon" alt="" class="w-6 h-6" />
          <img v-else :src="ChevronUpIcon" alt="" class="w-6 h-6" />
        </SwIconButton>
      </button>
    </div>
    <transition name="filter-collapse">
      <div v-if="isFilterVisible" :id="props.filter.code" class="self-stretch flex flex-col justify-start items-start gap-4">
        <fieldset class="self-stretch flex flex-col justify-start items-start gap-4">
        <legend class="sr-only">{{ props.filter.name }}</legend>
        <label
          v-for="option in props.filter.options || props.filter.entities"
          :key="`${option.id}-${(selectedOptionIds).includes(option.id)}`"
          class="self-stretch inline-flex justify-start items-start gap-2 cursor-pointer"
          @click="emits('select-value', { code: props.filter.code, value: option.id })"
        >
          <div class="w-4 self-stretch pt-[3px] flex justify-start items-start gap-2.5">
            <SwCheckbox
              :label="''"
              :description="undefined"
              :disabled="false"
              :model-value="getChecked(option.id).value"
              @update:model-value="() => emits('select-value', { code: props.filter.code, value: option.id })"
              @click.stop
            />
          </div>
          <div class="flex-1 inline-flex flex-col justify-start items-start gap-0.5">
            <div data-count="true" data-disabled="no" data-type="Label" class="inline-flex justify-start items-center gap-1">
              <div class="flex-1 text-surface-on-surface text-base font-normal leading-normal">
                {{ getTranslatedProperty(option, 'name') }}
              </div>
              <!-- Optionally, add count or color swatch here if needed -->
            </div>
          </div>
        </label>
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

/* Smooth collapse/expand for filter options */
.filter-collapse-enter-active,
.filter-collapse-leave-active {
  transition: max-height 240ms ease, opacity 200ms ease;
  overflow: hidden;
}
.filter-collapse-enter-from,
.filter-collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
.filter-collapse-enter-to,
.filter-collapse-leave-from {
  max-height: 800px; /* large enough to contain options */
  opacity: 1;
}
</style>
