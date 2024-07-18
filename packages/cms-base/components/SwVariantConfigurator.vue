<script setup lang="ts">
import { getProductRoute } from "@shopware-pwa/helpers-next";
import { useCmsTranslations } from "@shopware-pwa/composables-next";
import { ref, computed, unref } from "vue";
import type { ComputedRef } from "vue";
import { defu } from "defu";
import { useProductConfigurator } from "#imports";
import { useRouter } from "vue-router";
import type { Schemas } from "#shopware";

const props = withDefaults(
  defineProps<{
    allowRedirect?: boolean;
  }>(),
  {
    allowRedirect: true,
  },
);

type Translations = {
  product: {
    chooseA: string;
  };
};

let translations: Translations = {
  product: {
    chooseA: "Choose a",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const emit = defineEmits<{
  (e: "change", selected: Partial<Schemas["Product"]> | undefined): void;
}>();
const isLoading = ref<boolean>();
const router = useRouter();
const {
  handleChange,
  getOptionGroups,
  getSelectedOptions,
  findVariantForSelectedOptions,
} = useProductConfigurator();

const selectedOptions: ComputedRef = computed(() =>
  Object.values(unref(getSelectedOptions)),
);
const isOptionSelected = (optionId: string) =>
  Object.values(getSelectedOptions.value).includes(optionId);

const onHandleChange = async () => {
  isLoading.value = true;
  const variantFound = await findVariantForSelectedOptions(
    unref(selectedOptions),
  );

  const selectedOptionsVariantPath = getProductRoute(variantFound);
  if (props.allowRedirect && selectedOptionsVariantPath) {
    try {
      router.push(selectedOptionsVariantPath);
    } catch (error) {
      console.error("incorrect URL", selectedOptionsVariantPath);
    }
  } else {
    emit("change", variantFound);
  }
  isLoading.value = false;
};
</script>

<template>
  <div class="flex flex-col">
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center z-10 bg-white/75"
    >
      <div
        data-testid="loading"
        class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-gray-500"
      />
    </div>
    <div
      v-for="optionGroup in getOptionGroups"
      :key="optionGroup.id"
      class="mt-6"
    >
      <h3 class="text-sm text-gray-900 font-medium">{{ optionGroup.name }}</h3>
      <fieldset class="mt-4 flex-1">
        <legend class="sr-only">
          {{ translations.product.chooseA }} {{ optionGroup.name }}
        </legend>
        <div class="flex gap-3">
          <label
            v-for="option in optionGroup.options"
            :key="option.id"
            data-testid="product-variant"
            class="group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer"
            :class="{
              'border-3 border-indigo-600': isOptionSelected(option.id),
            }"
            @click="handleChange(optionGroup.name, option.id, onHandleChange)"
          >
            <p
              :id="`${option.id}-choice-label`"
              data-testid="product-variant-text"
            >
              {{ option.name }}
            </p>
          </label>
        </div>
      </fieldset>
    </div>
  </div>
</template>
