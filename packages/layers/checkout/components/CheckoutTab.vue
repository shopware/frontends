<script setup>
const props = defineProps({
  number: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["toggle"]);
</script>

<template>
  <div class="border-b border-[#e8e8e8]">
    <div 
      class="flex items-center gap-4 mb-6 cursor-pointer" 
      @click="emit('toggle')"
    >
      <div 
        class="flex items-center justify-center w-12 h-12 rounded-full font-medium text-xl transition-colors"
        :class="isActive ? 'bg-[#543b95] text-white' : 'bg-[#e1d5ff] text-[#3a276a]'"
      >
        {{ number }}
      </div>
      <h2 class="text-2xl font-normal text-[#1d1b20] flex-grow text-left">{{ title }}</h2>
      <div :class="isActive ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down'" class="text-[#79747e] h-6 w-6"></div>
    </div>
    
    <div 
      v-if="isActive" 
      class="pb-6 space-y-6 transition-all duration-300 ease-in-out"
    >
      <slot></slot>
    </div>
  </div>
</template>