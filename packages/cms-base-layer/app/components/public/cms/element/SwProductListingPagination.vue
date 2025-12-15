<script setup lang="ts">
type Translations = {
  listing: {
    perPage: string;
    product: string;
    products: string;
  };
};

defineProps<{
  total: number;
  current: number;
  limit: number;
  translations: Translations;
}>();

const emit = defineEmits<{
  changePage: [page: number];
  changeLimit: [limit: number];
}>();

const limitModel = defineModel<number>("limit", { required: true });

const handlePageChange = (page: number) => {
  emit("changePage", page);
};

const handleLimitChange = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  emit("changeLimit", Number(select.value));
};
</script>

<template>
  <div v-if="total > 0" class="flex flex-col gap-6 sm:gap-8 mt-6 sm:mt-8">
    <!-- Pagination Controls -->
    <div class="flex justify-center w-full">
      <SwPagination :total="total" :current="current" @change-page="handlePageChange" />
    </div>

    <!-- Items per page selector -->
    <div class="flex justify-center items-center gap-3 sm:gap-4">
      <label
        for="limit"
        class="text-sm sm:text-base text-surface-on-surface"
        data-testid="listing-pagination-limit-label"
      >
        {{ translations.listing.perPage }}
      </label>
      <div class="relative">
        <select
          id="limit"
          v-model="limitModel"
          name="limitchoices"
          class="appearance-none bg-surface-surface border border-outline-outline hover:border-outline-outline-primary focus:border-outline-outline-primary focus:ring-2 focus:ring-outline-outline-primary focus:ring-opacity-20 px-4 py-2 pr-10 rounded-md text-sm sm:text-base text-surface-on-surface cursor-pointer transition-colors"
          data-testid="listing-pagination-limit-select"
          @change="handleLimitChange"
        >
          <option :value="1">1 {{ translations.listing.product }}</option>
          <option :value="15">15 {{ translations.listing.products }}</option>
          <option :value="30">30 {{ translations.listing.products }}</option>
          <option :value="45">45 {{ translations.listing.products }}</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <SwChevronIcon direction="down" :size="16" />
        </div>
      </div>
    </div>
  </div>
</template>
