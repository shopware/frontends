<script setup lang="ts">
defineProps(["total", "current"]);
defineEmits(["changePage"]);
</script>
<template>
<div class="bg-white justify-center px-4 py-3 flex  border-t border-gray-200 sm:px-6">
  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
    <button  v-if="current-1 >= 1" @click="$emit('changePage', current -1)"  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
      <span class="sr-only">Previous</span>
      <!-- Heroicon name: solid/chevron-left -->
      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
    <button v-if="current > 2" @click="$emit('changePage', 1)" aria-current="page" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> 1 </button>
    <span v-if="current - 1  > 2" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"> ... </span>
    <button v-if="current > 1" @click="$emit('changePage', current -1)" aria-current="page" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> {{ current -1 }} </button>
    <button aria-current="page" class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> {{ current }} </button>
    <button v-if="current < total" @click="$emit('changePage', current + 1)" aria-current="page" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> {{ current +1 }}</button>
    <span v-if="total - current > 2" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"> ... </span>
    <button v-if="total - current > 1" @click="$emit('changePage', total)" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> {{ total }}</button>
    <button v-if="total > current+1" @click="$emit('changePage', total)" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
      <span class="sr-only">Next</span>
      <!-- Heroicon name: solid/chevron-right -->
      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
  </nav>
</div>
</template>