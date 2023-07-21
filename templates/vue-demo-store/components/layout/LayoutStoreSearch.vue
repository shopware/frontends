<script setup lang="ts">
import { RouterLink } from "vue-router";
import { getProductUrl } from "@shopware-pwa/helpers-next";

import { onClickOutside, useFocus, useMagicKeys } from "@vueuse/core";
import {
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline';

const headerMode = useState<'default' | 'transparent'>('headerMode');

withDefaults(
  defineProps<{
    displayTotal?: number;
  }>(),
  { displayTotal: 10 }
);

const { searchTerm, search, getProducts, getTotal, loading } =
  useProductSearchSuggest();

// True when the search bar is active and user can type in the search field
const active = ref(false);

// Reference to the search container
const searchContainer = ref(null);
const searchInput = ref();

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

const isSideMenuOpened = inject("isSideMenuOpened", ref(false));

watch(enter, (value) => {
  if (!value) return;

  isSideMenuOpened.value = false;

  active.value = false;
  push("/search?query=" + typingQuery.value);
});
</script>

<template>
  <div
    ref="searchContainer"
    class="sw-search-input lg:min-w-[240px] relative group py-2.25 px-3 md:py-2 pr-0 transition duration-300 inline-block"
    :class="[headerMode === 'transparent' ? 'bg-white bg-opacity-25 text-white' : 'bg-gray-100 text-gray-400']"
  >
    <div class="flex items-center">
      <MagnifyingGlassIcon
        :class="[
          'sw-search-input-icon flex-none h-5 w-5 cursor-pointer',
          headerMode === 'transparent' ? 'text-white' : 'text-gray-700'
        ]"
      />

      <input
        ref="searchInput"
        v-model="typingQuery"
        data-testid="layout-search-input"
        type="text"
        :class="[
          'sw-search-input text-base md:text-sm placeholder:capitalize font-normal mx-2.5 md:ml-0 xl:ml-2 grow h-6 transition duration-200 focus:outline-none w-56 md:w-10/12',
          headerMode === 'transparent' ? 'bg-transparent placeholder:text-white text-white' : 'bg-gray-100 placeholder:text-gray-500 text-gray-700'
        ]"
        :placeholder="$t('search')"
        @click="active = true"
      >
    </div>
    <div
      v-if="showSuggest"
      class="absolute border-gray-100 border-t-1 duration-300 left-0 mt-2 overflow-hidden right-0 rounded-b-md shadow-md transition-height w-auto z-1"
    >
      <RouterLink
        v-for="product in getProducts.slice(0, displayTotal)"
        :key="product.id"
        :to="getProductUrl(product)"
        data-testid="layout-search-suggest-link"
        @click="[(active = false), (isSideMenuOpened = false)]"
      >
        <ProductSuggestSearch :product="product" />
      </RouterLink>

      <div
        class="h-11 text-sm rounded-b-md p-3 text-center transition"
        style="clip-path: inset(0% 0% 0% 0%)"
        :class="[loading ? ['bg-brand-primary'] : ['bg-gray-100']]"
      >
        <div
          v-if="loading"
          class="w-80 h-40 bg-brand-light blur-2xl fixed animate-spin"
        />
        <div v-else>
          <RouterLink
            v-if="getTotal > 0"
            :to="`/search?query=${typingQuery}`"
            @click="[(active = false), (isSideMenuOpened = false)]"
          >
            See <span v-if="getTotal !== 1">all</span> {{ getTotal }}
            <span v-if="getTotal !== 1">results</span>
            <span v-if="getTotal == 1">result</span>
          </RouterLink>
          <div v-else>
            No results :(
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.scrolling-down .header-default .header-mobile .sw-search-input {
  height: 0 !important;
  overflow: hidden;
  padding: 0;
  opacity: 0;
  margin: 0;
}
.header-mobile .sw-search-input {
  height: 42px;
  opacity: 1;
  display: flex;
  transition: height 0.3s;
}
</style>
