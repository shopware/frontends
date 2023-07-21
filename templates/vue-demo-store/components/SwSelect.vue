<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import {
  CheckIcon,
  ChevronDownIcon
} from '@heroicons/vue/20/solid';

const props = withDefaults(
  defineProps<{
    name?: string;
    label?: string;
    labelRequired?: boolean;
    compact?: boolean;
    modelValue?: string;
    options: {
      label: string,
      value: any
    }[],
    placeholder?: string;
    errors?: any[];
    position?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
  }>(),
  {
    compact: true,
    position: 'bottom-right'
  }
);
const value = ref('');
const emit = defineEmits(['update:modelValue'])

const attrs = useAttrs();

const remainingAttrs = computed(()=>{
  let returnObj: any = {}
  // use const below
  for (const attr in attrs) {
    if (attr !== 'class') {
      returnObj[attr] = attrs[attr]
    }
  }
  return returnObj;
});

const getValueOption = computed(() => {
  return props.options?.find(x => x.value === value?.value);
});

watch(value, (v) => {
  if (props.modelValue !== v) {
    emit('update:modelValue', v);
  }
});

watch(() => props.modelValue, (v) => {
  if (v && value.value !== v) {
    value.value = v;
  }
}, {
  immediate: true
});

</script>
<template>
  <div>
    <label
      v-if="label"
      class="text-sm font-medium text-gray-700 mb-1"
      :class="{
        'text-red-700': props.errors?.length
      }"
      :for="name"
    >
      {{ label }}
      <span v-if="labelRequired">*</span>
    </label>
    <Listbox
      :id="name"
      :class="['flex relative', !props.compact && 'border px-3 py-2', props.errors?.length ? 'text-red-700 border-red-700 ring-red-500' : 'border-gray-300 ring-gray-700']"
      as="div"
      v-model="value"
    >
      <ListboxButton class="relative w-full cursor-default font-medium pr-6 bg-transparent cursor-pointer text-sm">
        <span
          :class="{
            'opacity-50': !getValueOption?.label,
            'block truncate text-left': true
          }"
        >
          {{ getValueOption?.label || props.placeholder }}
        </span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center">
          <ChevronDownIcon class="h-5 w-5 text-current" />
        </span>
      </ListboxButton>

      <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <ListboxOptions
          class="absolute min-w-50 w-full trans z-30 mt-1 max-h-60 overflow-hidden bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          :class="{
            '-bottom-2 translate translate-y-full right-0': position === 'bottom-right',
            '-top-2 translate -translate-y-full right-0': position === 'top-right',
            '-bottom-2 translate translate-y-full left-0': position === 'bottom-left',
            '-top-2 translate -translate-y-full left-0': position === 'top-left'
          }"
        >
          <ListboxOption as="template" v-for="item in options" :key="item.value" :value="item.value" v-slot="{ active, selected }">
            <li :class="[active ? 'bg-gray-700 text-white' : 'text-gray-900', 'relative cursor-pointer select-none py-2 px-4']">
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ item.label }}</span>
              <span v-if="selected" :class="[active ? 'text-white' : 'text-gray-700', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </Listbox>
  </div>
</template>