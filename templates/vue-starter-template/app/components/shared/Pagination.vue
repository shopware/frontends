<script setup lang="ts">
defineProps<{
  total: number;
  current: number;
}>();

defineEmits<{
  changePage: [page: number];
}>();
</script>
<template>
  <nav
    class="relative z-0 inline-flex rounded-md shadow-sm space-x-px"
    aria-label="Pagination"
  >
    <button
      v-if="current - 1 >= 2"
      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-outline-outline-variant bg-white text-sm  outline outline-1 outline-offset-[-1px] outline-outline-outline-variant"
      @click="$emit('changePage', current - 1)"
    >
      <SwChevronIcon direction="left" :size="20" />
    </button>
    <button
      v-if="current > 2"
      class="bg-white border-outline-outline-variant relative inline-flex items-center px-4 py-2 border text-sm  outline outline-1 outline-offset-[-1px] outline-outline-outline-variant"
      @click="$emit('changePage', 1)"
    >
      1
    </button>
    <span
      v-if="current - 1 > 2"
      class="relative inline-flex items-center px-4 py-2 border border-outline-outline-variant bg-white text-sm  outline outline-1 outline-offset-[-1px] outline-outline-outline-variant"
    >
      ...
    </span>
    <button
      v-if="current > 1"
      class="bg-white border-outline-outline-variant relative inline-flex items-center px-4 py-2 border text-sm  outline outline-1 outline-offset-[-1px] outline-outline-outline-variant"
      :class="[
        current == 2
          ? 'rounded-l-md border border-outline-outline-variant'
          : '',
      ]"
      @click="$emit('changePage', current - 1)"
    >
      {{ current - 1 }}
    </button>
    <button
      aria-current="page"
      class="bg-brand-primary text-brand-on-primary relative inline-flex items-center px-4 py-2 border text-sm "
      :class="[
        current - 1 >= 1
          ? ''
          : 'rounded-l-md border border-outline-outline-variant',
        total == current
          ? 'rounded-r-md border border-outline-outline-variant'
          : '',
      ]"
    >
      {{ current }}
    </button>
    <button
      v-if="current < total"
      class="bg-white border-outline-outline-variant relative inline-flex items-center px-4 py-2 border text-sm "
      :class="[
        total == current + 1
          ? 'rounded-r-md border border-outline-outline-variant'
          : '',
      ]"
      @click="$emit('changePage', current + 1)"
    >
      {{ current + 1 }}
    </button>
    <span
      v-if="total - current > 2"
      class="relative inline-flex items-center px-4 py-2 border border-outline-outline-variant bg-white text-sm "
    >
      ...
    </span>
    <button
      v-if="total - current > 1"
      class="bg-white border-outline-outline-variant relative inline-flex items-center px-4 py-2 border text-sm "
      @click="$emit('changePage', total)"
    >
      {{ total }}
    </button>
    <button
      v-if="total > current + 1"
      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-outline-outline-variant bg-white text-sm "
      @click="$emit('changePage', current + 1)"
    >
      <SwChevronIcon direction="right" :size="20" />
    </button>
  </nav>
</template>
