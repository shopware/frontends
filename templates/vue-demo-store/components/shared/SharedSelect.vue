<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

const props = defineProps<{
  options: Record<string, any>[];
  selectedOption: string;
}>();
const emit = defineEmits(["change"]);
const onChange = (event: any) => {
  emit("change", event);
};

const selected = computed(() => {
  return props.options.find((o) => o.id === props.selectedOption);
});
</script>

<template>
  <Listbox @update:model-value="onChange">
    <div class="relative mt-1">
      <ListboxButton
        class="relative border border-gray-300 py-2 px-3 h-9 text-sm text-dark-primary w-full shadow-input text-left"
      >
        {{ selected?.name }}
        <p class="text-left" />
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <ChevronDownIcon class="h-5 w-5 text-gray-500" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base ring-1 ring-gray-300 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="option in options"
            v-slot="{ active, selected }"
            :key="(option as any).id"
            :value="option"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-gray-200' : 'bg-white',
                'relative cursor-default select-none p-2.5 text-gray-700',
              ]"
            >
              <span
                :class="[
                  selected ? 'font-semibold' : 'font-normal',
                  'block truncate',
                ]"
              >{{ (option as any).name }}</span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
