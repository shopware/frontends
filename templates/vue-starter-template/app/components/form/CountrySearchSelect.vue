<script lang="ts" setup>
import { encodeForQuery } from "@shopware/api-client/helpers";
import { onClickOutside, useDebounceFn } from "@vueuse/core";
import type { MaybeRef } from "vue";

import type { Schemas } from "#shopware";

import CountrySearchSelectFlag from "./CountrySearchSelect/Flag.vue";
import CountrySearchSelectOption from "./CountrySearchSelect/Option.vue";

const model = defineModel<string>({
  required: true,
});

const {
  id = "country",
  label = "",
  placeholder = "",
  errorMessage = undefined,
  limit = 20,
  autocomplete = "country-name",
  disabled = false,
  dataTestId = "country-select",
} = defineProps<{
  id?: string;
  label?: string;
  placeholder?: string;
  errorMessage?: MaybeRef<string>;
  limit?: number;
  autocomplete?: string;
  disabled?: boolean;
  dataTestId?: string;
}>();

const emit = defineEmits<{
  select: [country: Schemas["Country"] | null];
  "states-change": [states: Schemas["CountryState"][]];
  blur: [];
}>();

const { apiClient, cacheableReads } = useShopwareContext();

const rootElement = useTemplateRef<HTMLElement>("rootElement");
const searchInput = useTemplateRef<HTMLInputElement>("searchInput");
const listElement = useTemplateRef<HTMLElement>("listElement");

const countries = ref<Schemas["Country"][]>([]);
const selectedCountry = shallowRef<Schemas["Country"] | null>(null);
const searchTerm = shallowRef("");
const page = shallowRef(1);
const total = shallowRef(0);
const isOpen = shallowRef(false);
const isInitialLoading = shallowRef(false);
const isLoadingMore = shallowRef(false);
const hasFetchError = shallowRef(false);
const highlightedIndex = shallowRef(-1);
const singleCountryMode = shallowRef(false);
let requestId = 0;

const errorText = computed(() => unref(errorMessage));
const selectedCountryName = computed(() =>
  selectedCountry.value
    ? selectedCountry.value.translated?.name || selectedCountry.value.name || ""
    : "",
);
const displayedValue = computed(() =>
  isOpen.value ? searchTerm.value : selectedCountryName.value,
);
const inputValue = computed({
  get: () => displayedValue.value,
  set: (value: string) => {
    searchTerm.value = value;
  },
});
const hasMore = computed(() => {
  if (!countries.value.length) return false;
  if (total.value) return countries.value.length < total.value;
  return countries.value.length >= limit;
});
const isLoading = computed(() => isInitialLoading.value || isLoadingMore.value);
const shouldShowList = computed(
  () => isOpen.value && !singleCountryMode.value && !disabled,
);
const activeDescendant = computed(() =>
  highlightedIndex.value >= 0
    ? `${id}-option-${highlightedIndex.value}`
    : undefined,
);

useHead({
  link: [
    {
      rel: "preconnect",
      href: "https://flagcdn.com",
    },
  ],
});

function isSelectedCountry(country: Schemas["Country"]) {
  return model.value === country.id;
}

function getCountryStates(country: Schemas["Country"] | null) {
  return country?.states ?? [];
}

function emitCountry(country: Schemas["Country"] | null) {
  emit("select", country);
  emit("states-change", getCountryStates(country));
}

function buildCriteria(options: {
  page: number;
  term?: string;
  ids?: string[];
}): Schemas["Criteria"] {
  return {
    associations: {
      states: {},
    },
    ids: options.ids,
    limit,
    page: options.page,
    term: options.term || undefined,
    "total-count-mode": "exact",
  };
}

function invokeCountrySearch(criteria: Schemas["Criteria"]) {
  return cacheableReads
    ? apiClient.invoke("readCountryGet get /country", {
        query: { _criteria: encodeForQuery(criteria) },
      })
    : apiClient.invoke("readCountry post /country", {
        body: criteria,
      });
}

async function fetchCountries(options: {
  page?: number;
  term?: string;
  append?: boolean;
  ids?: string[];
}) {
  const nextPage = options.page ?? 1;
  const term = options.term?.trim() ?? "";
  const append = options.append ?? false;
  const currentRequestId = ++requestId;

  if (append) {
    isLoadingMore.value = true;
  } else {
    isInitialLoading.value = true;
  }

  hasFetchError.value = false;

  try {
    const criteria = buildCriteria({
      page: nextPage,
      term,
      ids: options.ids,
    });
    const result = await invokeCountrySearch(criteria);

    if (currentRequestId !== requestId) return;

    const elements = result.data.elements ?? [];
    countries.value = append ? [...countries.value, ...elements] : elements;
    total.value = result.data.total ?? elements.length;
    page.value = nextPage;

    if (!append) {
      highlightedIndex.value = elements.length ? 0 : -1;
    }

    return result.data;
  } catch {
    if (currentRequestId === requestId) {
      hasFetchError.value = true;
    }
  } finally {
    if (currentRequestId === requestId) {
      isInitialLoading.value = false;
      isLoadingMore.value = false;
    }
  }
}

async function ensureSelectedCountry() {
  if (!model.value || selectedCountry.value?.id === model.value) return;

  const existingCountry = countries.value.find(
    (country) => country.id === model.value,
  );

  if (existingCountry) {
    selectedCountry.value = existingCountry;
    emitCountry(existingCountry);
    return;
  }

  try {
    const result = await invokeCountrySearch(
      buildCriteria({
        ids: [model.value],
        page: 1,
      }),
    );
    const country = result.data.elements?.[0] ?? null;
    selectedCountry.value = country;
    emitCountry(country);
  } catch {
    hasFetchError.value = true;
  }
}

function selectCountry(country: Schemas["Country"] | null) {
  selectedCountry.value = country;
  model.value = country?.id ?? "";
  searchTerm.value = "";
  isOpen.value = false;
  highlightedIndex.value = -1;
  emitCountry(country);
}

async function loadInitialCountries() {
  const response = await fetchCountries({
    page: 1,
  });

  if (!response) return;

  const elements = response.elements ?? [];
  if (!searchTerm.value && (response.total ?? elements.length) === 1) {
    singleCountryMode.value = true;
    selectCountry(elements[0] ?? null);
    return;
  }

  singleCountryMode.value = false;
  await ensureSelectedCountry();
}

const searchCountries = useDebounceFn(async () => {
  singleCountryMode.value = false;
  await fetchCountries({
    page: 1,
    term: searchTerm.value,
  });
}, 300);

async function openList() {
  if (disabled || singleCountryMode.value) return;

  isOpen.value = true;

  if (!countries.value.length && !isInitialLoading.value) {
    await fetchCountries({
      page: 1,
      term: searchTerm.value,
    });
  }
}

function closeList() {
  isOpen.value = false;
  searchTerm.value = "";
  highlightedIndex.value = -1;
}

function handleInput() {
  isOpen.value = true;
  searchCountries();
}

function handleFocus() {
  openList();
}

function handleBlur() {
  emit("blur");
}

function moveHighlight(direction: 1 | -1) {
  if (!countries.value.length) return;

  openList();
  const lastIndex = countries.value.length - 1;
  const nextIndex = highlightedIndex.value + direction;

  if (nextIndex < 0) {
    highlightedIndex.value = lastIndex;
  } else if (nextIndex > lastIndex) {
    highlightedIndex.value = 0;
  } else {
    highlightedIndex.value = nextIndex;
  }
}

function handleEnter() {
  if (!shouldShowList.value) {
    openList();
    return;
  }

  const country = countries.value[highlightedIndex.value];
  if (country) selectCountry(country);
}

function handleEscape() {
  closeList();
  searchInput.value?.blur();
}

async function handleScroll() {
  const list = listElement.value;
  if (!list || !hasMore.value || isLoading.value) return;

  const distanceFromBottom =
    list.scrollHeight - list.scrollTop - list.clientHeight;

  if (distanceFromBottom > 40) return;

  await fetchCountries({
    append: true,
    page: page.value + 1,
    term: searchTerm.value,
  });
}

watch(model, async (countryId) => {
  if (!countryId) {
    selectedCountry.value = null;
    emitCountry(null);
    return;
  }

  await ensureSelectedCountry();
});

watch(
  countries,
  () => {
    if (!selectedCountry.value && model.value) {
      const country = countries.value.find((item) => item.id === model.value);
      if (country) {
        selectedCountry.value = country;
        emitCountry(country);
      }
    }
  },
  { deep: false },
);

onMounted(loadInitialCountries);

onClickOutside(rootElement, closeList);
</script>

<template>
  <div ref="rootElement" class="relative">
    <label
      v-if="label"
      class="text-surface-on-surface text-sm mb-1 block"
      :for="id"
    >
      {{ label }}
    </label>

    <div v-if="singleCountryMode">
      <div
        class="flex items-center gap-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-outline-outline-variant bg-surface-surface-disabled px-4 pt-2 pb-2.5"
      >
        <CountrySearchSelectFlag :country="selectedCountry" />
        <input
          :id="id"
          class="text-sm w-full outline-none bg-transparent text-surface-on-surface-disabled"
          :value="selectedCountryName"
          :autocomplete="autocomplete"
          :data-testid="dataTestId"
          disabled
        />
      </div>
    </div>

    <div v-else>
      <div
        class="focus-within:outline-2 focus-within:outline-outline-outline-focus focus-within:outline focus-within:outline-offset-[2px] rounded-lg"
      >
        <div
          :class="{
            'outline-states-error': !!errorText,
            'bg-surface-surface-disabled': disabled,
            'bg-surface-surface': !disabled,
          }"
          class="flex items-center rounded-lg px-4 pt-2 pb-2.5 outline-outline-outline-variant outline outline-1 text-surface-on-surface-variant outline-offset-[-1px]"
        >
          <CountrySearchSelectFlag
            v-if="selectedCountry && !isOpen"
            class="mr-2"
            :country="selectedCountry"
          />
          <input
            :id="id"
            ref="searchInput"
            v-model="inputValue"
            role="combobox"
            class="text-sm w-full outline-none bg-transparent text-surface-on-surface placeholder:text-surface-on-surface-variant disabled:text-surface-on-surface-disabled"
            :aria-activedescendant="activeDescendant"
            :aria-controls="`${id}-listbox`"
            :aria-expanded="shouldShowList"
            aria-autocomplete="list"
            :autocomplete="autocomplete"
            :data-testid="dataTestId"
            :disabled="disabled"
            :placeholder="placeholder"
            @focus="handleFocus"
            @input="handleInput"
            @blur="handleBlur"
            @keydown.down.prevent="moveHighlight(1)"
            @keydown.up.prevent="moveHighlight(-1)"
            @keydown.enter.prevent="handleEnter"
            @keydown.esc.prevent="handleEscape"
          />

          <span
            class="i-carbon-chevron-down h-4 w-4 flex-none text-surface-on-surface-variant"
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        v-if="shouldShowList"
        :id="`${id}-listbox`"
        ref="listElement"
        role="listbox"
        class="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-outline-outline-variant bg-surface-surface p-1 shadow-lg"
        @scroll="handleScroll"
      >
        <div
          v-if="isInitialLoading"
          class="px-4 py-3 text-sm text-surface-on-surface-variant"
        >
          {{ $t("form.loading") }}
        </div>

        <div
          v-else-if="hasFetchError"
          class="px-4 py-3 text-sm text-states-error"
        >
          {{ $t("form.countrySearchError") }}
        </div>

        <div
          v-else-if="!countries.length"
          class="px-4 py-3 text-sm text-surface-on-surface-variant"
        >
          {{ $t("form.noCountryResults") }}
        </div>

        <template v-else>
          <CountrySearchSelectOption
            v-for="(country, index) in countries"
            :id="`${id}-option-${index}`"
            :key="country.id"
            :country="country"
            :selected="isSelectedCountry(country)"
            @highlight="highlightedIndex = index"
            @select="selectCountry"
          />

          <div
            v-if="isLoadingMore"
            class="px-4 py-3 text-sm text-surface-on-surface-variant"
          >
            {{ $t("form.loadingMoreCountries") }}
          </div>
        </template>
      </div>
    </div>

    <span v-if="errorText" class="text-states-error text-xs block mt-1">
      {{ errorText }}
    </span>
  </div>
</template>
