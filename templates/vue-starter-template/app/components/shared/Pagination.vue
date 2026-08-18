<script setup lang="ts">
const { total, current } = defineProps<{
  total: number;
  current: number;
}>();

defineEmits<{
  changePage: [page: number];
}>();

const VISIBLE_PAGES = 7;

const ELLIPSIS = "ellipsis" as const;

type PaginationCell = number | typeof ELLIPSIS;

const cells = computed<PaginationCell[]>(() => {
  const pages = Math.max(1, total);
  const size = Math.min(VISIBLE_PAGES, pages);

  const start = Math.min(
    Math.max(1, current - Math.floor(size / 2)),
    Math.max(1, pages - size + 1),
  );
  const end = start + size - 1;

  const visible: PaginationCell[] = Array.from(
    { length: size },
    (_, index) => start + index,
  );

  if (start > 1) {
    visible[0] = 1;
    visible[1] = ELLIPSIS;
  }

  if (end < pages) {
    visible[size - 1] = pages;
    visible[size - 2] = ELLIPSIS;
  }

  return visible;
});
</script>
<template>
  <nav
    class="relative z-0 inline-flex rounded-md shadow-sm space-x-px"
    :aria-label="$t('layout.ariaLabels.pagination')"
  >
    <button
      type="button"
      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-outline-outline-variant bg-white text-sm outline outline-1 outline-offset-[-1px] outline-outline-outline-variant disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="current <= 1"
      :aria-label="$t('layout.ariaLabels.previousPage')"
      @click="$emit('changePage', current - 1)"
    >
      <SwChevronIcon direction="left" :size="20" />
    </button>

    <template v-for="(cell, index) in cells" :key="index">
      <span
        v-if="cell === ELLIPSIS"
        aria-hidden="true"
        class="relative inline-flex items-center justify-center min-w-[3rem] px-4 py-2 border border-outline-outline-variant bg-white text-sm outline outline-1 outline-offset-[-1px] outline-outline-outline-variant"
      >
        ...
      </span>
      <button
        v-else
        type="button"
        class="relative inline-flex items-center justify-center min-w-[3rem] px-4 py-2 border text-sm"
        :class="
          cell === current
            ? 'bg-brand-primary text-brand-on-primary'
            : 'bg-white border-outline-outline-variant outline outline-1 outline-offset-[-1px] outline-outline-outline-variant'
        "
        :aria-current="cell === current ? 'page' : undefined"
        :disabled="cell === current"
        @click="$emit('changePage', cell)"
      >
        {{ cell }}
      </button>
    </template>

    <button
      type="button"
      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-outline-outline-variant bg-white text-sm outline outline-1 outline-offset-[-1px] outline-outline-outline-variant disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="current >= total"
      :aria-label="$t('layout.ariaLabels.nextPage')"
      @click="$emit('changePage', current + 1)"
    >
      <SwChevronIcon direction="right" :size="20" />
    </button>
  </nav>
</template>
