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
  <div class="flex items-center gap-2 justify-between">
    <SharedPagination
      @change-page="handleChangePage"
      :total="pages"
      :current="currentPage"
    />
    <SharedSizeSelector @change="handleChangeSize" :value="pageSize ?? 15" />
  </div>
</template>
