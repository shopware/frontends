<script setup lang="ts">
type BaseProps = {
  pages: number;
  currentPage: number;
};

type WithPerPageSelector = BaseProps & {
  showPageSizeSelector: true;
  pageSize: number;
};

type WithoutPerPageSelector = BaseProps & {
  showPageSizeSelector: false;
  pageSize?: number;
};

const props = defineProps<WithPerPageSelector | WithoutPerPageSelector>();

const emit = defineEmits<{
  changePage: [page: number];
  changeSize: [size: number];
}>();

function handleChangePage(page: number) {
  emit("changePage", page);
}

function handleChangeSize(size: number) {
  emit("changeSize", size);
}
</script>
<template>
  <div
    class="flex flex-col items-center gap-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-2"
  >
    <SharedPagination
      class="sm:col-start-2"
      @change-page="handleChangePage"
      :total="pages"
      :current="currentPage"
    />
    <SharedSizeSelector
      v-if="showPageSizeSelector"
      class="sm:col-start-3 sm:justify-self-end"
      @change="handleChangeSize"
      :value="pageSize ?? 15"
    />
  </div>
</template>
