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
  <div class="relative flex items-center justify-center gap-2">
    <SharedPagination
      @change-page="handleChangePage"
      :total="pages"
      :current="currentPage"
    />
    <SharedSizeSelector
      v-if="showPageSizeSelector"
      class="absolute right-0"
      @change="handleChangeSize"
      :value="pageSize ?? 15"
    />
  </div>
</template>
