<script setup lang="ts">
defineProps<{
  total: number;
  current: number;
}>();

defineEmits<{
  (e: "changePage", page: number): void;
}>();
</script>
<template>
  <div
    v-if="total > 1"
    class="bg-white justify-center px-4 py-3 flex border-t border-gray-200 sm:px-6"
  >
    <nav
      class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
      aria-label="Pagination"
    >
      <button
        v-if="current - 1 >= 1"
        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        @click="$emit('changePage', current - 1)"
      >
        <span class="sr-only">Previous</span>
        <!-- Heroicon name: solid/chevron-left -->
        <div class="w-5 h-5 i-carbon-chevron-left" />
      </button>
      <button
        v-if="current > 2"
        aria-current="page"
        class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
        @click="$emit('changePage', 1)"
      >
        1
      </button>
      <span
        v-if="current - 1 > 2"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
      >
        ...
      </span>
      <button
        v-if="current > 1"
        aria-current="page"
        class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
        @click="$emit('changePage', current - 1)"
      >
        {{ current - 1 }}
      </button>
      <button
        aria-current="page"
        class="bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
      >
        {{ current }}
      </button>
      <button
        v-if="current < total"
        aria-current="page"
        class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
        @click="$emit('changePage', current + 1)"
      >
        {{ current + 1 }}
      </button>
      <span
        v-if="total - current > 2"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
      >
        ...
      </span>
      <button
        v-if="total - current > 1"
        class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
        @click="$emit('changePage', total)"
      >
        {{ total }}
      </button>
      <button
        v-if="total > current + 1"
        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        @click="$emit('changePage', total)"
      >
        <span class="sr-only">Next</span>
        <!-- Heroicon name: solid/chevron-right -->
        <div class="w-5 h-5 i-carbon-chevron-right" />
      </button>
    </nav>
  </div>
</template>
