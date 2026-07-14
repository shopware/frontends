<script setup lang="ts">
const props = defineProps<{
  currentLanguageId: string;
  languages: {
    id: string;
    label: string;
  }[];
  currentCurrencyId: string;
  currencies: {
    id: string;
    label: string;
  }[];
  changingCurrencyId?: string;
}>();

defineSlots<{
  menu(): unknown;
}>();

const emit = defineEmits<{
  onLanguageChangeHandler: [string];
  onCurrencyChangeHandler: [string];
}>();

const selectedCurrencyId = computed({
  get: () => props.changingCurrencyId ?? props.currentCurrencyId,
  set: (currencyId: string) => {
    if (currencyId && currencyId !== props.currentCurrencyId) {
      emit("onCurrencyChangeHandler", currencyId);
    }
  },
});

function changeLanguage(event: Event) {
  const languageId = (event.target as HTMLSelectElement).value;
  if (languageId && languageId !== props.currentLanguageId) {
    emit("onLanguageChangeHandler", languageId);
  }
}
</script>
<template>
  <div class="bg-surface-surface-primary py-2.5">
    <div
      class="flex items-center justify-between container mx-auto color-surface-on-surface-primary"
    >
      <div class="flex flex-wrap items-center gap-2">
        <label
          v-if="languages.length > 1"
          class="relative inline-flex h-9 items-center gap-2 rounded border border-white/15 bg-white/10 pl-3 pr-2 text-sm transition hover:bg-white/15 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white/70"
        >
          <Icon size="1.125rem" name="carbon:language" />
          <span class="sr-only">
            {{ $t("layout.ariaLabels.languageSwitcher") }}
          </span>
          <select
            class="h-full min-w-24 appearance-none bg-transparent pr-7 text-sm font-medium outline-none"
            :aria-label="$t('layout.ariaLabels.languageSwitcher')"
            :value="currentLanguageId"
            @change="changeLanguage"
          >
            <option
              v-for="language in languages"
              :key="language.id"
              :value="language.id"
            >
              {{ language.label }}
            </option>
          </select>
          <Icon
            size="1rem"
            name="carbon:chevron-down"
            class="pointer-events-none absolute right-2"
          />
        </label>

        <label
          v-if="currencies.length > 0"
          class="relative inline-flex h-9 items-center gap-2 rounded border border-white/15 bg-white/10 pl-3 pr-2 text-sm transition hover:bg-white/15 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white/70"
          :class="{ 'opacity-60': Boolean(props.changingCurrencyId) }"
        >
          <Icon size="1.125rem" name="carbon:currency" />
          <span class="sr-only">
            {{ $t("layout.ariaLabels.currencySwitcher") }}
          </span>
          <select
            class="h-full min-w-23 appearance-none bg-transparent pr-7 text-sm font-medium outline-none disabled:cursor-not-allowed"
            :aria-label="$t('layout.ariaLabels.currencySwitcher')"
            v-model="selectedCurrencyId"
            :disabled="
              currencies.length < 2 || Boolean(props.changingCurrencyId)
            "
          >
            <option
              v-for="currency in currencies"
              :key="currency.id"
              :value="currency.id"
            >
              {{ currency.label }}
            </option>
          </select>
          <Icon
            size="1rem"
            name="carbon:chevron-down"
            class="pointer-events-none absolute right-2"
          />
        </label>
      </div>
      <menu>
        <slot name="menu" />
      </menu>
    </div>
  </div>
</template>
