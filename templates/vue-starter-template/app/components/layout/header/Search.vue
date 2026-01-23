<script lang="ts" setup>
import { getProductRoute } from "@shopware/helpers";
import type { Schemas } from "#shopware";

const { apiClient } = useShopwareContext();
const model = defineModel<string>({ required: true });
const suggestElements = ref<Schemas["ProductListingResult"]["elements"]>([]);
const suggestElementsTotal = ref(0);
const searchTerm = ref("");
const loading = ref(false);

const { handleApiError } = useApiErrorsResolver("suggest_search");
const { displayTotal = 10 } = defineProps<{
  displayTotal?: number;
}>();

async function getSuggestElements(value: string) {
  try {
    const response = await apiClient.invoke(
      "searchSuggest post /search-suggest",
      {
        body: {
          search: value,
        },
      },
    );
    return response;
  } catch (error) {
    handleApiError(error);
    return {
      data: {
        elements: [],
        total: 0,
      },
    };
  }
}

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const performSuggestSearch = useDebounceFn(async (value) => {
  searchTerm.value = value;
  loading.value = true;
  try {
    const data = await getSuggestElements(value);
    suggestElements.value = data.data.elements;
    suggestElementsTotal.value = data.data.total || 0;
  } finally {
    loading.value = false;
  }
}, 300);

const showSuggest = computed(
  () => model.value.length >= 3 && suggestIsActive.value,
);

watch(model, async (value) => {
  if (value.length >= 3) {
    performSuggestSearch(value);
  } else {
    suggestElements.value = [];
    suggestElementsTotal.value = 0;
  }
});

const refSearchBox = useTemplateRef("searchBox");
const suggestIsActive = ref(true);
onClickOutside(refSearchBox, () => {
  suggestIsActive.value = false;
});

const router = useRouter();
const handleEnterKey = () => {
  if (showSuggest.value && model.value) {
    suggestIsActive.value = false;
    router.push({
      path: "/search",
      query: { search: model.value },
    });
  }
};
</script>

<template>
  <div ref="searchBox">
    <FormBaseInput
      v-model="model"
      :placeholder="$t('search.placeholder')"
      @click="suggestIsActive = true"
      @focus="suggestIsActive = true"
      @keydown.enter="handleEnterKey"
    >
      <template #rightIcon>
        <Icon
          name="shopware:search-s"
          class="color-surface-on-surface-variant rotate-90 ml-2"
        />
      </template>
    </FormBaseInput>

    <div
      v-if="showSuggest"
      data-testid="layout-search-result-box"
      class="absolute top-full left-0 mt-2 border-1 border-outline-outline-variant rounded-lg shadow-lg overflow-hidden z-20 bg-surface-surface w-full"
    >
      <NuxtLink
        v-for="product in suggestElements?.slice(0, displayTotal)"
        :key="product.id"
        :to="formatLink(getProductRoute(product))"
        data-testid="layout-search-suggest-link"
        @click="suggestIsActive = false"
      >
        <SearchSuggest :product="product" />
      </NuxtLink>

      <div
        class="h-11 text-sm p-3 text-center transition border-t-1 border-outline-outline-variant flex items-center justify-center"
        :class="{
          loading: [
            'bg-surface-surface-container text-surface-on-surface-variant',
          ],
        }"
      >
        <div
          v-if="loading"
          class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
        />
        <div v-else class="flex items-center justify-center">
          <NuxtLink
            v-if="suggestElementsTotal > 0"
            data-testid="layout-search-result-box-more-link"
            :to="formatLink({ path: `/search`, query: { search: model } })"
            @click="suggestIsActive = false"
          >
            {{ $t("search.see") }}
            <span v-if="suggestElementsTotal !== 1">{{
              $t("search.all")
            }}</span>
            {{ suggestElementsTotal }}
            <span>{{ $t("search.result", suggestElementsTotal) }}</span>
          </NuxtLink>
          <div v-else data-testid="layout-search-result-box-no-result">
            {{ $t("search.noResults") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
