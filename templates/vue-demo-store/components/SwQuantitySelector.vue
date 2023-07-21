<script setup lang="ts">
import {
  PlusIcon,
  MinusIcon
} from '@heroicons/vue/24/outline';

const props = withDefaults(
  defineProps<{
    modelValue: number;
    min?: number;
    max?: number;
  }>(),
  {
    modelValue: 1,
    min: 1,
  }
);
const emit = defineEmits(['update:modelValue'])
const decrement = () => {
  if (props.modelValue - 1 < props.min) {
    return;
  }
  emit('update:modelValue', props.modelValue - 1);
}

const increment = () => {
  if (props.max && props.modelValue + 1 > props.max) {
    return;
  }
  emit('update:modelValue', props.modelValue + 1);
}
const updateValue = (value: number) => {
  const valueInt = +value;
  if (valueInt < props.min) {
    emit('update:modelValue', props.min);
  } else if (props.max && valueInt > props.max) {
    emit('update:modelValue', props.max);
  } else {
    emit('update:modelValue', valueInt);
  }
}
</script>

<template>
  <div class="flex flex-row h-[50px] w-[5.625rem] bg-white shadow-sm border border-gray-300 relative">
    <button :disabled="props.modelValue === props.min" data-action="decrement" class="pl-1 disabled:opacity-20 h-full outline-none" @click="decrement">
      <MinusIcon class="h-6 w-6" />
    </button>
    <input 
      type="number"
      class="appearance-none outline-none flex-1 min-w-0 text-base text-center"
      :value="props.modelValue"
      @input="event => updateValue((event.target as any)?.value || 0)">
    <button :disabled="!!(props.max && props.modelValue === props.max)" data-action="increment" class="pr-1 disabled:opacity-20 h-full outline-none" @click="increment">
      <PlusIcon class="h-6 w-6" />
    </button>
  </div>
</template>
