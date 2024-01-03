<script setup lang="ts">
import { getProductRoute } from "@shopware-pwa/helpers-next";

import { onClickOutside, useFocus, useMagicKeys } from "@vueuse/core";

withDefaults(
  defineProps<{
    displayTotal?: number;
  }>(),
  { displayTotal: 10 },
);

defineEmits<{
  (e: "link-clicked"): void;
}>();

const { searchTerm, search, getProducts, getTotal, loading } =
  useProductSearchSuggest();

// True when the search bar is active and user can type in the search field
const active = ref(false);

// Reference to the search container
const searchContainer = ref(null);
const searchInput = ref();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

watch(active, (value) => {
  const { focused } = useFocus(searchInput);

  focused.value = value;
});

// String the user has typed in the search field
const typingQuery = ref("");

watch(typingQuery, (value) => {
  if (value.length >= 3) {
    performSuggestSearch(value);
  }
});

// Defer the search request to prevent the search from being triggered too after typing
const performSuggestSearch = useDebounceFn((value) => {
  searchTerm.value = value;
  search();
}, 300);

// Suggest results will only be shown, when the search bar is active and the user has typed more than three characters in the search field
const showSuggest = computed(() => {
  return typingQuery.value.length >= 3 && active.value;
});

if (process.client) {
  onClickOutside(searchContainer, () => {
    active.value = false;
  });
}

const { enter } = useMagicKeys({ target: searchInput });
const { push } = useRouter();

const sideMenuModal = useSideMenuModal();

watch(enter, (value) => {
  if (!value) return;

  sideMenuModal.close();

  active.value = false;
  push("/search?search=" + typingQuery.value);
});
</script>

<template>
  <div
    ref="searchContainer"
    class="relative group p-3 pr-0 rounded-lg transition duration-300 hover:shadow-md inline-block w-full"
    :class="[active ? 'shadow-lg' : 'shadow']"
  >
    <div class="flex items-center">
      <div
        class="sw-search-input i-carbon-search flex-none h-6 w-6 text-secondary-400 group-hover:text-primary cursor-pointer"
      />

      <input
        ref="searchInput"
        v-model="typingQuery"
        data-testid="layout-search-input"
        type="text"
        aria-label="Search for products"
        class="sw-search-input text-secondary-600 placehotext-secondary-600y-600 focus:text-secondary-700 p-2 ml-2 lg:ml-0 xl:ml-2 grow h-6 transition duration-200 focus:outline-none w-56 lg:w-10/12"
        :placeholder="$t('form.searchPlaceholder')"
        @click="active = true"
      />
    </div>
    <div
      v-if="showSuggest"
      data-testid="layout-search-result-box"
      class="absolute border-secondary-100 border-t-1 duration-300 left-0 mt-2 overflow-hidden right-0 rounded-b-md shadow-md transition-height w-auto z-1"
    >
      <NuxtLink
        v-for="product in getProducts?.slice(0, displayTotal)"
        :key="product.id"
        :to="formatLink(getProductRoute(product))"
        data-testid="layout-search-suggest-link"
        @click="[(active = false), $emit('link-clicked')]"
      >
        <ProductSuggestSearch :product="product" />
      </NuxtLink>

      <div
        class="h-11 text-sm rounded-b-md p-3 text-center transition"
        style="clip-path: inset(0% 0% 0% 0%)"
        :class="[loading ? ['bg-primary'] : ['bg-secondary-100']]"
      >
        <div
          v-if="loading"
          class="w-80 h-40 bg-light blur-2xl fixed animate-spin"
        />
        <div v-else>
          <NuxtLink
            v-if="getTotal > 0"
            data-testid="layout-search-result-box-more-link"
            :to="
              formatLink({ path: `/search`, query: { search: typingQuery } })
            "
            @click="[(active = false), $emit('link-clicked')]"
          >
            {{ $t("search.see") }}
            <span v-if="getTotal !== 1">{{ $t("search.all") }}</span>
            {{ getTotal }}
            <span>{{ $t("search.result", getTotal) }}</span>
          </NuxtLink>
          <div v-else data-testid="layout-search-result-box-no-result">
            {{ $t("search.noResults") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
